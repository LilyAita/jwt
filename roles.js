const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("visitante").readAny("products");

  ac.grant("cliente").extend("visitante").createAny("products");

  ac.grant("admin").extend("cliente").readAny("auth");

  return ac;
})();