const fs = require('node:fs');
const path = require('node:path');

const curriculumPath = path.join(__dirname, '..', 'curriculum', 'vestiqo-curriculum.json');
const raw = fs.readFileSync(curriculumPath, 'utf8');
const curriculum = JSON.parse(raw);
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function words(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean).length;
}

function required(value, field, context) {
  assert(value !== undefined && value !== null && value !== '', context + ': missing ' + field);
}

assert(!/[Ââð][^\s]?/.test(raw), 'Encoding: detected likely mojibake characters.');
assert(curriculum.schemaVersion === '2.0.0', 'Schema: expected version 2.0.0.');
assert(Array.isArray(curriculum.modules) && curriculum.modules.length === 16, 'Modules: expected exactly 16.');
assert(Array.isArray(curriculum.moduleTree) && curriculum.moduleTree.length === 16, 'Module tree: expected exactly 16 entries.');
assert(Array.isArray(curriculum.labs) && curriculum.labs.length === 10, 'Labs: expected exactly 10.');
assert(Array.isArray(curriculum.licenses) && curriculum.licenses.length === 5, 'Licenses: expected exactly 5.');

const lessons = curriculum.modules.flatMap((module) => module.lessons || []);
const lessonIds = new Set(lessons.map((lesson) => lesson.id));
assert(lessons.length >= 150 && lessons.length <= 250, 'Lessons: expected 150–250, found ' + lessons.length + '.');
assert(lessonIds.size === lessons.length, 'Lessons: IDs must be unique.');

curriculum.modules.forEach((module, moduleIndex) => {
  const context = 'Module ' + (moduleIndex + 1) + ' (' + module.name + ')';
  required(module.outcome, 'outcome', context);
  assert(Array.isArray(module.lessons) && module.lessons.length === 10, context + ': expected 10 lessons.');
  assert(Array.isArray(module.submodules) && module.submodules.length === 3, context + ': expected Understand, Apply and Master submodules.');

  const treeEntry = curriculum.moduleTree.find((entry) => entry.id === module.id);
  assert(Boolean(treeEntry), context + ': missing moduleTree entry.');
  const referenced = (module.submodules || []).flatMap((submodule) => submodule.lessonIds || []);
  assert(referenced.length === 10, context + ': submodules must reference 10 lessons.');
  assert(new Set(referenced).size === 10, context + ': submodule lesson references must be unique.');
  referenced.forEach((id) => assert(lessonIds.has(id), context + ': unknown lesson reference ' + id + '.'));

  (module.lessons || []).forEach((lesson, lessonIndex) => {
    const lessonContext = lesson.id + ' (' + lesson.lessonName + ')';
    required(lesson.moduleName, 'moduleName', lessonContext);
    required(lesson.lessonName, 'lessonName', lessonContext);
    required(lesson.learningObjective, 'learningObjective', lessonContext);
    required(lesson.definition, 'definition', lessonContext);
    required(lesson.visualUnderstanding, 'visualUnderstanding', lessonContext);
    required(lesson.practiceExercise, 'practiceExercise', lessonContext);
    required(lesson.realMarketExample, 'realMarketExample', lessonContext);
    required(lesson.masteryChallenge, 'masteryChallenge', lessonContext);
    required(lesson.aiTutorPrompts, 'aiTutorPrompts', lessonContext);

    assert(['Beginner', 'Intermediate', 'Advanced'].includes(lesson.difficulty), lessonContext + ': invalid difficulty.');
    assert(Number.isInteger(lesson.estimatedDurationMinutes) && lesson.estimatedDurationMinutes >= 2 && lesson.estimatedDurationMinutes <= 5, lessonContext + ': duration must be 2–5 minutes.');
    assert([40, 60, 80].includes(lesson.xpReward), lessonContext + ': invalid XP reward.');
    assert(words(lesson.definition) <= 50, lessonContext + ': definition exceeds 50 words (' + words(lesson.definition) + ').');
    assert(/\d/.test(lesson.visualUnderstanding.workedExample || ''), lessonContext + ': visual example must include numbers.');
    assert(Array.isArray(lesson.prerequisites), lessonContext + ': prerequisites must be an array.');
    (lesson.prerequisites || []).forEach((id) => assert(lessonIds.has(id), lessonContext + ': unknown prerequisite ' + id + '.'));

    const quiz = lesson.quiz || [];
    assert(quiz.length === 6, lessonContext + ': expected 6 quiz questions.');
    assert(quiz.filter((item) => item.type === 'mcq').length === 3, lessonContext + ': expected 3 MCQs.');
    assert(quiz.filter((item) => item.type === 'scenario').length === 2, lessonContext + ': expected 2 scenario questions.');
    assert(quiz.filter((item) => item.type === 'real_life').length === 1, lessonContext + ': expected 1 real-life question.');
    quiz.forEach((item, questionIndex) => {
      const qContext = lessonContext + ' Q' + (questionIndex + 1);
      required(item.question, 'question', qContext);
      required(item.explanation, 'explanation', qContext);
      required(item.correctAnswer, 'correctAnswer', qContext);
      assert(Array.isArray(item.options) && item.options.length === 4, qContext + ': expected 4 options.');
      assert(Number.isInteger(item.correctOptionIndex) && item.correctOptionIndex >= 0 && item.correctOptionIndex < 4, qContext + ': invalid correctOptionIndex.');
      if (Array.isArray(item.options) && Number.isInteger(item.correctOptionIndex)) {
        assert(item.options[item.correctOptionIndex] === item.correctAnswer, qContext + ': correct answer/index mismatch.');
        assert(new Set(item.options).size === item.options.length, qContext + ': options must be unique.');
      }
    });

    assert(lesson.masteryChallenge.passScore === 75, lessonContext + ': mastery pass score must be 75.');
    const scoreTotal = Object.values(lesson.masteryChallenge.scoring || {}).reduce((sum, value) => sum + value, 0);
    assert(scoreTotal === 100, lessonContext + ': mastery scoring weights must total 100.');
    assert(Array.isArray(lesson.aiTutorPrompts) && lesson.aiTutorPrompts.length >= 4, lessonContext + ': expected at least 4 AI tutor prompts.');

    if (lessonIndex === 0 && moduleIndex === 0) {
      assert(lesson.prerequisites.length === 0, lessonContext + ': first lesson should have no prerequisite.');
    } else {
      assert(lesson.prerequisites.length === 1, lessonContext + ': expected one prerequisite.');
    }
  });
});

curriculum.labs.forEach((lab) => {
  const context = 'Lab ' + lab.name;
  required(lab.purpose, 'purpose', context);
  required(lab.difficulty, 'difficulty', context);
  assert(Array.isArray(lab.levels) && lab.levels.length === 4, context + ': expected 4 levels.');
  assert(lab.scoringLogic.passScore === 70, context + ': pass score must be 70.');
  const weightTotal = Object.values(lab.scoringLogic.dimensions || {}).reduce((sum, dimension) => sum + dimension.weight, 0);
  assert(weightTotal === 100, context + ': scoring weights must total 100.');
});

const licenseOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
curriculum.licenses.forEach((license, index) => {
  const context = 'License ' + license.name;
  assert(license.name === licenseOrder[index], context + ': licenses are out of order.');
  assert(license.lessonsRequired <= lessons.length, context + ': lesson requirement exceeds curriculum.');
  assert(license.minimumReadinessScore >= 0 && license.minimumReadinessScore <= 100, context + ': readiness score out of range.');
  assert(Array.isArray(license.practicalChallenges) && license.practicalChallenges.length >= 3, context + ': expected practical challenges.');
  assert(Array.isArray(license.unlockRewards) && license.unlockRewards.length >= 3, context + ': expected unlock rewards.');
});

required(curriculum.systems.completeLearningPath, 'completeLearningPath', 'Systems');
required(curriculum.systems.practiceSystems, 'practiceSystems', 'Systems');
required(curriculum.systems.quizSystem, 'quizSystem', 'Systems');
required(curriculum.systems.xpSystem, 'xpSystem', 'Systems');
required(curriculum.systems.readinessScore, 'readinessScore', 'Systems');
required(curriculum.systems.portfolioHealth, 'portfolioHealth', 'Systems');
required(curriculum.systems.recommendedLearningSequence, 'recommendedLearningSequence', 'Systems');

assert(curriculum.totals.modules === curriculum.modules.length, 'Totals: module count mismatch.');
assert(curriculum.totals.lessons === lessons.length, 'Totals: lesson count mismatch.');
assert(curriculum.totals.lessonQuizQuestions === lessons.reduce((sum, lesson) => sum + lesson.quiz.length, 0), 'Totals: quiz count mismatch.');
assert(curriculum.totals.labs === curriculum.labs.length, 'Totals: lab count mismatch.');
assert(curriculum.totals.licenses === curriculum.licenses.length, 'Totals: license count mismatch.');

const definitionFingerprints = new Set(lessons.map((lesson) => lesson.definition.toLowerCase()));
assert(definitionFingerprints.size === lessons.length, 'Content: lesson definitions must be unique.');
const objectiveFingerprints = new Set(lessons.map((lesson) => lesson.learningObjective.toLowerCase()));
assert(objectiveFingerprints.size === lessons.length, 'Content: learning objectives must be unique.');

if (errors.length) {
  console.error('Curriculum validation failed with ' + errors.length + ' error(s):');
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}

console.log('Curriculum validation passed.');
console.log('- ' + curriculum.modules.length + ' modules');
console.log('- ' + lessons.length + ' lessons');
console.log('- ' + curriculum.totals.lessonQuizQuestions + ' quiz questions');
console.log('- ' + curriculum.labs.length + ' practice labs');
console.log('- ' + curriculum.licenses.length + ' investor licenses');
