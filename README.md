# nuxt_learn

> My transcendent Nuxt.js project

## Build Setup

``` bash

$ cd project
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server

$ yarn run build
$ yarn start

# generate static project
$ yarn run generate

```
#### The directory structure 
##### 资源目录 assets
资源目录 assets 用于组织未编译的静态资源 如 Less Sass Jvascript

##### 组件目录 components 
组件目录 components 用于vue.js组件，Nuxt.js不会扩展改目录下vue.js组件，该部分组件不会像页面组件那样有 asyncData 方法的特性

##### 布局目录 layouts 
布局目录 layouts 用于组织应用的布局组件。<font color=red>该目录名为Nuxt.js保留的，不可更改。</font>

##### middleware 目录
middleware 目录用于存放应用的中间件。

##### 页面目录 pages
页面目录 pages 用于组织应用的路由及视图。Nuxt.js 框架读取该目录下所有的 .vue 文件并自动生成对应的路由配置。<font color=red>该目录名为Nuxt.js保留的，不可更改。</font>

##### 插件目录 plugins
插件目录 plugins 用于组织那些需要在 根vue.js应用 实例化之前需要运行的 Javascript 插件。

##### 静态文件目录 static
静态文件目录 static 用于存放应用的静态文件，此类文件不会被 Nuxt.js 调用 Webpack 进行构建编译处理。 服务器启动的时候，该目录下的文件会映射至应用的根路径 / 下。<font color=red>该目录名为Nuxt.js保留，不可更改。</font>

##### store 目录
store 目录用于组织应用的 Vuex 状态树 文件。 Nuxt.js 框架集成了 Vuex 状态树 的相关功能配置，在 store 目录下创建一个 index.js 文件可激活这些配置。

##### nuxt.config.js
nuxt.config.js 文件用于组织Nuxt.js 应用的个性化配置，以便覆盖默认配置。<font color=red>该文件名为Nuxt.js保留的，不可更改。</font>

##### package.json 文件
package.json 文件用于描述应用的依赖关系和对外暴露的脚本接口。<font color=red>该文件名为Nuxt.js保留的，不可更改。</font>

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).


##### 关于一些坑的解决

- 如果提示 session store is unavaliable，退出服务，先运行redis 和 mongoed, 将服务跑起来，