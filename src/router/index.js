import {createRouter, createWebHashHistory} from 'vue-router';
import { ElNotification } from 'element-plus';
import config from "@/config"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import tool from '@/utils/tool';
import systemRouter from './systemRouter';
import userRoutes from '@/config/route';
import {beforeEach, afterEach} from './scrollBehavior';

//系统路由
const routes = systemRouter

//系统特殊路由
const routes_404 = {
	path: "/:pathMatch(.*)*",
	hidden: true,
	component: () => import(/* webpackChunkName: "404" */ '@/layout/other/404'),
}
let routes_404_r = ()=>{}

const router = createRouter({
	history: createWebHashHistory(),
	routes: routes
})

//设置标题
document.title = config.APP_NAME

//判断是否已加载过动态/静态路由
var isGetRouter = false;

router.beforeEach(async (to, from, next) => {

	NProgress.start()
	//动态标题
	document.title = to.meta.title ? `${to.meta.title} - ${config.APP_NAME}` : `${config.APP_NAME}`

	let token = tool.cookie.get("TOKEN");
	if(to.path === "/login"){
		//删除路由(替换当前layout路由)
		router.addRoute(routes[0])
		//删除路由(404)
		routes_404_r()
		isGetRouter = false;
		next();
		return false;
	}
	if(!token){
		next({
			path: '/login'
		});
		return false;
	}
	if(routes.findIndex(r => r.path === to.path) >= 0){
		next();
		return false;
	}

	//整页路由处理
	if(to.meta.fullpage){
		to.matched = [to.matched[to.matched.length-1]]
	}
	//加载动态/静态路由
	if(!isGetRouter){
		let apiMenu = tool.data.get("MENU") || []
		let userInfo = tool.data.get("USER_INFO")
		let userMenu = mergeMenuApiauth(userInfo)
		// let userMenu = treeFilter(userRoutes, node => {
		// 	return node.meta.role ? node.meta.role.filter(item=>userInfo.role.indexOf(item)>-1).length > 0 : true
		// })
		let menu = [...userMenu, ...apiMenu]
		var menuRouter = filterAsyncRouter(menu)
		menuRouter = flatAsyncRoutes(menuRouter)
		menuRouter.forEach(item => {
			router.addRoute("layout", item)
		})
		routes_404_r = router.addRoute(routes_404)
		if (to.matched.length == 0) {
			router.push(to.fullPath);
		}
		isGetRouter = true;
	}
	beforeEach(to, from)
	next();
});

router.afterEach((to, from) => {
	afterEach(to, from)
	NProgress.done()
});

router.onError((error) => {
	NProgress.done();
	ElNotification.error({
		title: '路由错误',
		message: error.message
	});
});

//入侵追加自定义方法、对象
router.sc_getMenu = () => {
	var apiMenu = tool.data.get("MENU") || []
	let userInfo = tool.data.get("USER_INFO")
	let userMenu = mergeMenuApiauth(userInfo)
	// let userMenu = treeFilter(userRoutes, node => {
	// 	return node.meta.role ? node.meta.role.filter(item=>userInfo.role.indexOf(item)>-1).length > 0 : true
	// })
	var menu = [...userMenu, ...apiMenu]
	return menu
}

//
/*
* 合并前端路由和接口权限的数据
* 1、判断模块是否有权限显示
* 2、把模块名称赋予给菜单
* 3、把模块权限赋予给菜单
**/
function mergeMenuApiauth(userInfo)
{
	if(!userInfo)
		return []
	var newUserRoute = []
	var siteUserInfo = userInfo.user.site_app_auth
	// console.log(siteUserInfo)
	siteUserInfo.forEach(userItem => {
		// console.log('----1-----',userItem)
		var app_auth = userItem.app_auth
		Object.entries(userRoutes).forEach(([routeKey,routeItem]) => {
			// console.log('----2-----',routeKey,routeItem)

			//以防万一，理论上是不会出现status !=1的状态
			if(app_auth[routeItem.meta.sign].status == 1)
				{
					routeItem.meta.title = app_auth[routeItem.meta.sign].name
					if(routeItem.children)
						{
							var appModules = app_auth[routeItem.meta.sign].modules
							Object.entries(routeItem.children).forEach(([childKey,childItem]) => {
								if(appModules[childItem.meta.sign])//先判断节点存在
									{
										if(appModules[childItem.meta.sign].status == 1)
											{
												routeItem.children[childKey].meta.title = appModules[childItem.meta.sign].name
												// routeItem.children[childKey].meta.auth_actions = appModules[childItem.meta.sign].auth_actions
												// console.log('----dddd--',routeItem.children[childKey])
											}
											else//后面status 可能会=2，=0，再说
											{
												// alert(1)
												routeItem.children = routeItem.children.splice(childKey, 1)
											}
										
									}//节点不存在，删节点
									else
									{
										routeItem.children = routeItem.children.splice(childKey, 1)
									}
								// console.log(childKey,childItem)
							})
						}

					newUserRoute[routeKey] = routeItem

					// console.log('-----app_auth---',app_auth)
					//说明该模块是有权限的
				}
			// console.log('----4-----',routeItem.meta.sign)
			// console.log('----5-----',userItem)
			// console.log('----real-----',newUserRoute)
			// console.log('----old-----',routeItem)

		})
		//console.log(userRoutes)
	})
	if(newUserRoute)
		{
			return newUserRoute
		}
		return userRoutes
}

//转换
function filterAsyncRouter(routerMap) {
	const accessedRouters = []
	routerMap.forEach(item => {
		item.meta = item.meta?item.meta:{};
		//处理外部链接特殊路由
		if(item.meta.type=='iframe'){
			item.meta.url = item.path;
			item.path = `/i/${item.name}`;
		}
		//MAP转路由对象
		var route = {
			path: item.path,
			name: item.name,
			meta: item.meta,
			redirect: item.redirect,
			children: item.children ? filterAsyncRouter(item.children) : null,
			component: loadComponent(item.component)
		}
		accessedRouters.push(route)
	})
	return accessedRouters
}
function loadComponent(component){
	if(component){
		return () => import(/* webpackChunkName: "[request]" */ `@/views/${component}`)
	}else{
		return () => import(`@/layout/other/empty`)
	}

}

//路由扁平化
function flatAsyncRoutes(routes, breadcrumb=[]) {
	let res = []
	routes.forEach(route => {
		const tmp = {...route}
        if (tmp.children) {
            let childrenBreadcrumb = [...breadcrumb]
            childrenBreadcrumb.push(route)
            let tmpRoute = { ...route }
            tmpRoute.meta.breadcrumb = childrenBreadcrumb
            delete tmpRoute.children
            res.push(tmpRoute)
            let childrenRoutes = flatAsyncRoutes(tmp.children, childrenBreadcrumb)
            childrenRoutes.map(item => {
                res.push(item)
            })
        } else {
            let tmpBreadcrumb = [...breadcrumb]
            tmpBreadcrumb.push(tmp)
            tmp.meta.breadcrumb = tmpBreadcrumb
            res.push(tmp)
        }
    })
    return res
}

//过滤树
/*
function treeFilter(tree, func) {
	return tree.map(node => ({ ...node })).filter(node => {
		node.children = node.children && treeFilter(node.children, func)
		return func(node) || (node.children && node.children.length)
	})
}
*/

export default router
