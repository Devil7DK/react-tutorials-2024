# Ways to Bootstrap React Project

1. [Create React App](https://legacy.reactjs.org/docs/create-a-new-react-app.html) - Used to be the official method for creating react app internally uses Webpack
2. Creating a new project manually using a bundler like the following:
   1. [Webpack](https://webpack.js.org/) - Most popular bundler for React but relatively complex to setup and slow
   2. [Parcel](https://parceljs.org/) - Simplest bundler for React faster than Webpack but quite heavy (New recommended bundler in official docs)
   3. [Vite](https://vitejs.dev/) - Faster than both Webpack and Parcel but still not as popular (New recommended bundler in official docs)
   4. [Rollup](https://rollupjs.org/guide/en/) - One of the oldest bundlers for React but not as popular as Webpack internally used by some other bundlers like Vite
   5. [Browserify](http://browserify.org/)
   6. [Snowpack](https://www.snowpack.dev/)
   7. [Brunch](https://brunch.io/)
   8. More...
3. Using [Babel Standalone](https://babeljs.io/docs/en/babel-standalone) with React from CDN - Not recommended for production use
4. Using online IDEs (Suitable for prototying or quick experiments)
   1. [CodeSandbox](https://codesandbox.io/)
   2. [StackBlitz](https://stackblitz.com/)
   3. [CodePen](https://codepen.io/)
   4. [JSFiddle](https://jsfiddle.net/)
   5. More...
5. Using a boilerplate project/starter kits. Plenty of boilerplate projects & generaters available on Github and NPM
