import { DataSource } from 'apollo-datasource';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class Post {
  constructor (data) {
    this.voters = new Set();
    this.id = crypto.randomBytes(16).toString('hex');
    Object.assign(this, data);
  }
}

export class User {
    constructor(name, email, password) {
      this.id = crypto.randomBytes(16).toString('hex');
      this.name = name;
      this.email = email;
      this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
    }
}

export class InMemoryDataSource extends DataSource {
  constructor () {
    super();
    console.log('constructor of the InMemoryDataSource');
    this.posts = [];
    this.users = [];
  }

  // initialize(...args) {}

  allUsers() {
    return this.users;
  }

  getUser(id) {
    return this.users.find((user) => user.id === id);
  }

  getUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  allPosts() {
    return this.posts;
  }

  getPost(id) {
    return this.posts.find((post) => post.id === id);
  }

  createPost (data) {
    const newPost = new Post(data);
    this.posts.push(newPost);
    return newPost;
  }

  deletePost(postId) {
    // fitler post
    const deletedPost = this.posts.find((post) => post.id == postId);

    // delete Post from post array
    this.posts = this.posts.filter((post) => post.id != postId);

    return deletedPost;
  }

  //upvote a post
  upvotePost(postid, userid) {
    const post = this.getPost(postid);
    // return if user has allready upvoted post
    // if (post.voters.has(userid)) {
    //   return null;
    // }
    post.voters.add(userid);
    return post;
  }

  downvotePost(postid, userid) {
    const post = this.getPost(postid);
    post.voters.delete(userid);
    return post;
  }
}
