import Agenda from 'agenda';
import fp from 'mostly-func';

const defaultOptions = {
  collection: "job_agenda",
  options: {
    server: {
      auto_reconnect: true
    }
  }
};

export default function (options) {
  options = fp.assign({}, options, defaultOptions);
  const agenda = new Agenda({ db: options });
  agenda.on('ready', agenda.start);

  return function () {
    const app = this;
    app.agenda = agenda;
  };
}



