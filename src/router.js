import { createRouter as _createRouter, createWebHistory } from "vue-router";

const pages = import.meta.glob("../src/pages/**/*.vue");

// let homeRoute = {};
export const routes = Object.keys(pages).map((path) => {
  let name = path.match(/\/pages(.*)\.vue$/)[1].toLowerCase();
  if (name.substring(name.length - 5) == "index") {
    name = name.slice(0, -5); //去掉最后的index
  }
  // console.log("🚀 ~ file: router.js ~ line 4 ~ pages", pages[path], name);
  // if (name === "/home") {
  //   homeRoute = {
  //     path: "/",
  //     component: pages[path],
  //   };
  // }
  return {
    path: name === "/home/" ? "/" : name,
    component: pages[path],
  };
});
// routes.push(homeRoute);

export function createRouter() {
  return _createRouter({
    history: createWebHistory(),
    routes,
  });
}
