var test = require('tape');
var deepClone = require('../deepClone/deepClone.js');

test('deepClone', function (t) {
  var testObj = {
    name: "Paddy",
    address: {
      town: "Lerum",
      country: "Sweden"
    }
  };
  var testObjCopy = deepClone.clone(testObj);

  t.deepEqual(testObjCopy, testObj, 'makes a clone');

  testObjCopy.name = "Liam";

  t.notDeepEqual(testObjCopy, testObj, 'changing cloned obj doesn\'t affect original');

  delete testObj.name;
  delete testObjCopy.name;

  t.deepEqual(testObjCopy, testObj, 'removing differing key results in equality');

  t.end()
});

