
// @ts-ignore
import { PrismaClient } from '@prisma/client'

interface BlogCreate {
    name : string,
    description : string
}

interface BlogEdit extends BlogCreate {
    id : string,
}

interface BlogDelete {
    id : string,
}

const prisma = new PrismaClient()

const validations = ({name,description} : BlogCreate) => {
    if(!name){
        return false
    }

    if(name.length === 0 ){
        return false
    }

    if(!description){
        return false
    }

    if(description.length === 0 ){
        return false
    }

    return true
}

const getBlogs = async () => {

    const response = await prisma.blogs.findMany()

    return {
        success: true,
        data : response
    }
}

const create = async ({name, description}: BlogCreate) => {
    const validation = validations({name, description})
    if(!validation){
        return {
            success : false,
            message : 'Invalid Data'
        }
    }

    const response = await prisma.blogs.create({
        data : {
            name,
            description,
            author : 1,
            created_at : new Date()
        }
    })


    return {
        success: true,
        data : response
    }
}


const edit = async ({id,name, description}: BlogEdit) => {
    const validation = validations({name, description})

    if(!validation){
        return {
            success : false,
            message : 'Invalid Data'
        }
    }

    const blog = await prisma.blogs.findFirst({
        where : {
            id : parseInt(id)
        }
    })

    if(!blog){
        return {
            success : false,
            message : `Blog with ${id} number not found`
        }
    }

    const response = await prisma.blogs.update({
        where : {
            id : parseInt(id)
        },
        data : {
            name,
            description,
        }
    })


    return {
        success: true,
        data : response
    }
}

const remove = async ({id}: BlogDelete) => {

    const blog = await prisma.blogs.findFirst({
        where : {
            id : parseInt(id)
        }
    })

    if(!blog){
        return {
            success : false,
            message : `Blog with ${id} number not found`
        }
    }

    const response = await prisma.blogs.delete({
        where : {
            id : parseInt(id)
        },
    })


    return {
        success: true,
        data : response
    }
}


export {
    getBlogs,
    create,
    edit,
    remove,
    BlogCreate
}
