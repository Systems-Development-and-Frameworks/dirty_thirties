import { DataSource } from 'apollo-datasource'
import crypto from 'crypto'

export class Post {
  constructor (data) {
    this.voters = new Map()
    this.id = crypto.randomBytes(16).toString('hex')
    Object.assign(this, data)
  }
}

export class User {
    constructor(name) {
        this.name = name
    }
}

export default class InMemoryDataSource extends DataSource {
  constructor () {
    super()
    console.log('constructor of the InMemoryDataSource')
    this.post = []
    this.users = []
  }

  initialize ({ context }) {
    console.log('InMemoryDataSource: ', context)
  }

  allUsers() {
    return Promise.resolve(this.users)
  }

  getUser(name) {
    return Promise.resolve(this.users.find((user) => user.name === name))
  }

  allPosts() {
    return Promise.resolve(this.posts)
  }

  getPost(id) {
    return Promise.resolve(this.posts.find((post) => post.id === id))
  }

  //allPosts (data) {}
  createPost (data) {
    const newPost = new Post(data)
    this.posts.push(newPost)
    return newPost
  }

  //upvote a post
  upvotePost (id, user) {
    console.log("UPVOTE_POST"); //optional
    return this.getPost(id).then((post) => {
      post.voters.set(user, 1)
      return post
    });
  }
}
