const Agenda = require('agenda');
const fp = require('mostly-func');
const humanInterval = require('human-interval');

const defaultOptions = {
  db: {
    collection: "job_agenda",
    options: {
      server: {
        auto_reconnect: true
      }
    }
  },
  cleanAfter: '1 week',
  cleanChance: 0.1
};

module.exports = function (options) {
  options = fp.assignAll(defaultOptions, options);
  const agenda = new Agenda(options);
  agenda.on('ready', agenda.start);
  agenda.on('complete', job => {
    // remove old finished jobs sometimes
    if (Math.random() <= options.cleanChance) {
      const cleanDate = new Date(Date.now() - humanInterval(options.cleanAfter));
      agenda.cancel({ nextRunAt: null, lastFinishedAt: { $lte: cleanDate } }, err => {
        if (err) console.error('Failed to clean finished agenda jobs:', err);
      });
    }
  });

  return function () {
    const app = this;
    app.agenda = agenda;
  };
};