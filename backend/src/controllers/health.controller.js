// Controller de health-check: prova que o app <-> backend se comunicam.
function getHealth(req, res) {
  res.status(200).json({ status: 'ok' });
}

module.exports = { getHealth };
