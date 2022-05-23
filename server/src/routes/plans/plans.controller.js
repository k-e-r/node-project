const Plan = require('../../models/plan');

const setPlan = (req, res) => {
  const plan = new Plan(req.body);

  plan
    .save()
    .then(() => {
      res.status(201).json({
        msg: 'set plan succeeded',
        plan,
      });
    })
    .catch((err) => {
      res.status(400).json({
        msg: 'set plan failed',
        err,
      });
    });
};

const getPlans = (req, res) => {
  Plan.find({})
    .then((plan) => {
      res.status(200).json({
        msg: 'set plan succeeded',
        plan,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: 'set plan failed',
        err,
      });
    });
};

const getPlan = (req, res) => {
  const planId = req.params.id;

  Plan.findById(planId)
    .then((plan) => {
      res.status(200).json({
        msg: 'find plan succeeded',
        plan,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: 'plan not found',
        err,
      });
    });
};

module.exports = {
  setPlan,
  getPlans,
  getPlan,
};
