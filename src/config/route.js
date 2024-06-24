// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
// 示例如下

// const routes = [
// 	{
// 		name: "demo",
// 		path: "/demo",
// 		meta: {
// 			icon: "el-icon-eleme-filled",
// 			title: "演示",
// 			role: ["SA"]
// 		},
// 		children: [{
// 			name: "demopage",
// 			path: "/demopage",
// 			component: "test/autocode/index",
// 			meta: {
// 				icon: "el-icon-menu",
// 				title: "演示页面",
// 				role: ["SA"]
// 			}
// 		}]
// 	}
// ]

const routes = [{
    "name": "system",
    "path": "/system",
    "meta": {
        "title": "系统管理",
        "sign" : "system",
        "icon": "el-icon-setting",
        "type": "menu",

    },
    "children": [
        {
            "path": "/system/user",
            "name": "user",
            "meta": {
                "title": "用户管理",
                "sign" : "user",
                "icon": "el-icon-user-filled",
                "type": "menu"
            },
            "component": "system/user"
        },
        {
            "path": "/system/role",
            "name": "role",
            "meta": {
                "title": "角色权限",
                "sign": "role",
                "icon": "sc-icon-organization",
                "type": "menu"
            },
            "component": "system/role"
        },
        {
            "path": "/system/log",
            "name": "log",
            "meta": {
                "title": "操作日志",
                "sign": "log",
                "icon": "el-icon-notebook",
                "type": "menu"
            },
            "component": "system/log"
        },
        {
            "path": "/system/auth",
            "name": "auth",
            "meta": {
                "title": "系统授权",
                "sign": "auth",
                "icon": "el-icon-key",
                "type": "menu"
            },
            "component": "system/auth"
        },
    ]
}]

export default routes;
