import Agenda from 'agenda';
import fp from 'mostly-func';
import humanInterval from 'human-interval';

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

export default function (options) {
  options = fp.assign({}, options, defaultOptions);
  const agenda = new Agenda(options);
  agenda.on('ready', agenda.start);
  agenda.on('complete', job => {
    // remove old finished jobs sometimes
    if (Math.random() <= options.cleanChance) {
      const cleanDate = new Date(Date.now() - humanInterval(options.cleanAfter));
      agenda.cancel({ nextRunAt: null, lastFinishedAt: { $lte: cleanDate } }, (err) => {
        if (err) console.error('Failed to clean finished agenda jobs:', err);
      });
    }
  });

  return function () {
    const app = this;
    app.agenda = agenda;
  };
}
