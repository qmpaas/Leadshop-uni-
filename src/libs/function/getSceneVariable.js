function getSceneVariable(scene, variable) {
  var vars = scene.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
export default getSceneVariable;
