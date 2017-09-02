var fs = require('fs');

var HQPOINT = {
  lat: 51.515419,
  lon: -0.141099
};

console.log(main('./partners.json'));

function main(partnerFile) {
  var partners = readPartners(partnerFile);
  return getPartnerNamesWithinDistance(partners, 100).sort().join("\n");
}

function readPartners(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function getPartnerNamesWithinDistance(partners, testDistance) {
  var nearPartnersNames = [];

  partners.forEach(function(partner) {
    var distance = minDistanceFromHQ(partner);
    if(distance <= testDistance) {
      nearPartnersNames.push(partner.organization);
    }
  });
  return nearPartnersNames;
}

function minDistanceFromHQ(partner) {
  var points = getOfficePoints(partner);
  var minDistance = undefined;
  points.forEach(function(point) {
    var distance = calculateDistanceBetweenPoints(HQPOINT, point);
    if(minDistance == undefined || (
        minDistance != undefined &&
        distance < minDistance
       )
    ) {
      minDistance = distance;
    }
  });
  return minDistance;
}

function getOfficePoints(partner) {
  var points = [];

  partner.offices.forEach(function(office) {
    var coords = office.coordinates.split(/,/);
    var point = {
       lat: Number(coords[0]),
       lon: Number(coords[1])
    };
    points.push(point);
  });
  return points;
}

function calculateDistanceBetweenPoints(point1, point2) {
  // mean earth radius in km for WGS84 ellipsoid
  var earthRadius = 6371;

  // first set of lat/lon coordinates (HQ)
  var psi1 = degToRad(point1.lat);
  var lambda1 = degToRad(point1.lon);

  // second set of lat/lon coordinates
  var psi2 = degToRad(point2.lat);
  var lambda2 = degToRad(point2.lon);

  var deltaLambda = Math.abs(lambda1 - lambda2);

  // used Vicenty solution specified on Wikipedia page
  return Math.atan2(
    Math.sqrt(
      Math.pow((Math.cos(psi2) * Math.sin(deltaLambda)), 2) +
      Math.pow(
        Math.cos(psi1) * Math.sin(psi2) -
        Math.sin(psi1) * Math.cos(psi2) * Math.cos(deltaLambda),
        2
      )
    ), 
    (
      Math.sin(psi1) * Math.sin(psi2) +
      Math.cos(psi1) * Math.cos(psi2) * Math.cos(deltaLambda)
    )
  ) * earthRadius;
}

function degToRad(degrees) {
  return (Number(degrees) * Math.PI) / 180;
}

module.exports = {
  main: main,
  readPartners: readPartners,
  getPartnerNamesWithinDistance: getPartnerNamesWithinDistance,
  minDistanceFromHQ: minDistanceFromHQ,
  getOfficePoints: getOfficePoints,
  calculateDistanceBetweenPoints: calculateDistanceBetweenPoints,
  degToRad: degToRad
};

