import React from 'react';
import s from './About.module.css'
import photo from 'assets/images/me-for-todo.jpg'
import TelegramIcon from '@mui/icons-material/Telegram';

export const About = () => {
  return (
    <div className={'information'}>
      <div className={s.about}>
        <h1>About my project</h1>
        <div className={s.photoAndText}>
          <div className={s.image}>
            <img src={photo} alt=""/>
          </div>
          <div className={s.text}>
            <h3>Hi all! My name is Daniil</h3>
            <p>This is my project - Todolist.<br />
              In order to view the functionality, log in with my username and password.<br />
              LogIn: dfefelov@bk.ru<br />
              Password: 465865df<br />
              The backend is used by the IT incubator.<br />
              I can answer all questions in telegram -
              <a href="tg://resolve?domain=Danil_Fefelov" target="_blank" title="Telegram">
                <TelegramIcon />@<span>Danil_Fefelov</span>
              </a></p>
          </div>
        </div>
        <h2>Technology stack</h2>
        <ul>
          <li>Redux</li>
          <li>Redux Toolkit</li>
          <li>Axios</li>
          <li>Thunk</li>
          <li>React Router</li>
          <li>Material UI</li>
          <li>Formik</li>
          <li>Unit Tests</li>
        </ul>
      </div>
    </div>

  );
};