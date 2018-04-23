import Agenda from 'agenda';
import fp from 'mostly-func';

const defaultOptions = {
  db: {
    collection: "job_agenda",
    options: {
      server: {
        auto_reconnect: true
      }
    }
  }
};

export default function (options) {
  options = fp.assign({}, options, defaultOptions);
  const agenda = new Agenda(options);
  agenda.on('ready', agenda.start);

  return function () {
    const app = this;
    app.agenda = agenda;
  };
}
