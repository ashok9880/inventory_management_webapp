import login from './components/login.vue'
import products from './components/products.vue'
import users from './components/users.vue'
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        name: "LoginPage",
        component: login,
        path: '/'
    },
    {
        name: "ProductsPage",
        component: products,
        path: '/products'
    },
    {
        name: "UsersPage",
        component: users,
        path: '/users'
    },
]

const router = createRouter ({
    history: createWebHistory(),
    routes,
})

export default router