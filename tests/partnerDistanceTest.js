var test = require('tape');
var fs = require('fs');
var partnerDistance = require('../partnerDistance/partnerDistance.js');

var testPartners = JSON.parse(fs.readFileSync('partnersT1.json', 'utf8'));
var testPartnerOffices = {
  "offices": [
    {
      "coordinates": "51.5,-0.2",
    },
    {
      "coordinates": "60,5"
    },
    {
      "coordinates": "70,2"
    },
    {
      "coordinates": "50,-0.8"
    }
  ]
};

test('partnerDistance.main', function (t) {
  t.equal(partnerDistance.main("partnersT1.json"), "Cavendish Consultants\nLancashire Heavy Industries\nZiggurat Development Corp", 'returns orgs in alphabetical order');
  t.end();
});

test('partnerDistance.readPartners', function (t) {
  t.deepEqual(partnerDistance.readPartners("partnersT1.json"), testPartners, 'returns partners from file');
  t.end();
});

test('partnerDistance.getPartnerNamesWithinDistance', function (t) {
  t.deepEqual(
    partnerDistance.getPartnerNamesWithinDistance(testPartners, 100),
    [
      'Cavendish Consultants',
      'Ziggurat Development Corp',
      'Lancashire Heavy Industries'
    ], 'returns orgs within 100 km');

  t.deepEqual(
    partnerDistance.getPartnerNamesWithinDistance(testPartners, 500),
    [
      'Cavendish Consultants',
      'Ziggurat Development Corp',
      'Lancashire Heavy Industries',
      'Brussels Sprouts and Shouts'
    ], 'returns orgs within 500 km');
  t.end();
});

test('partnerDistance.minDistanceFromHQ', function (t) {
  t.equal(
    partnerDistance.minDistanceFromHQ(testPartnerOffices).toFixed(5),
    Number(4.422344034176655).toFixed(5),
    'returns minimum distance from HQ');
  t.end();
});

test('partnerDistance.getOfficePoints', function (t) {
    var points = [ 
      { lat: 51.5, lon: -0.2 },
      { lat: 60, lon: 5 },
      { lat: 70, lon: 2 },
      { lat: 50, lon: -0.8 }
    ];
  t.deepEqual(partnerDistance.getOfficePoints(testPartnerOffices), points, 'returns lat/lon points from coordinate strings');
  t.end();
});

test('partnerDistance.calculateDistanceBetweenPoints', function (t) {
  var point1 = { lat: 50, lon: 1 };
  var point2 = { lat: 52, lon: 3 };
  var point3 = { lat: 45, lon: 2 };
  t.equal(
    partnerDistance.calculateDistanceBetweenPoints(point1, point2).toFixed(5),
    Number(262.73981556343716).toFixed(5),
    'calculates distance'
  );
  t.equal(
    partnerDistance.calculateDistanceBetweenPoints(point2, point3).toFixed(5),
    Number(781.8230428289393).toFixed(5),
    'calculates distance'
  );
  t.equal(
    partnerDistance.calculateDistanceBetweenPoints(point3, point1).toFixed(5),
    Number(561.0121876805938).toFixed(5),
    'calculates distance'
  );
  t.end();
});

test('partnerDistance.degToRad', function (t) {
  t.equal(partnerDistance.degToRad(90), 1.5707963267948966, 'calculates radians');
  t.equal(partnerDistance.degToRad(47.3), 0.8255407361933179, 'calculates radians');
  t.end();
});

