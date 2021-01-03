import * as $ from 'jquery';
import Post from '@models/Post';
import './babel';
import React from 'react';
import { render } from 'react-dom';
// import json from './assets/json';
import WebpackLogo from './assets/img';
import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';

// console.log('json', json);

const post = new Post('Webpack post title', WebpackLogo);

// $('pre').addClass('code').html(post.toString());

const App = () => (
  <div className="container">
    <h1>Webpack course</h1>
    <hr />
    <div className="logo"></div>
    <hr />
    <pre />

    <div className="box">
      <h2>Less</h2>
    </div>

    <div className="card">
      <h2>Sass</h2>
    </div>
  </div>
);

render(<App />, document.getElementById('app'));

