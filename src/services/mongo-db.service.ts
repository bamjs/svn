import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import * as Realm from 'realm-web'

@Injectable({
  providedIn: 'root'
})
export class MongoDbService {
  private APP_ID:string =''
  private CLUSTER_NAME:string ='svn-invite'
  private DATABASE_NAME:string ='svn'
  private COLLECTION_NAME:string ='invite'
 constructor(private http:HttpClient,private jwt:JwtService) { }
  async insertOne(collectionName:string,document:{},database:string = this.DATABASE_NAME){
    const colClient = await this.getMongoClientWithCollection(database,collectionName);
    colClient.insertOne(document)
    .then(data=>{return data})
    .catch(err=>{
      console.error(err);
      throw err})
  }
  async deleteOne(collectionName:string,document:{},database:string = this.DATABASE_NAME,){
    const coll = await this.getMongoClientWithCollection(database,collectionName)
    coll.deleteOne(document).then(data=>{
      return data
    })
    .catch(err=>{
      console.error(err);
      throw err})
  }
  async findOne(collectionName:string,document:{},database:string = this.DATABASE_NAME,){
    const coll = await this.getMongoClientWithCollection(database,collectionName)
    coll.findOne(document).then(data=>{
      return data
    })
    .catch(err=>{
      console.error(err);
      throw err})
  }
  async findAll(collectionName:string,aggeratePipeline:{}[],database:string = this.DATABASE_NAME,){
    const coll = await this.getMongoClientWithCollection(database,collectionName)
    return coll.aggregate(aggeratePipeline)
  }
  async insertMany(collectionName:string,document:{}[],database:string=this.DATABASE_NAME){
    const col = await this.getMongoClientWithCollection(database,collectionName)
    return col.insertMany(document)
  }
  async getCollection(collectionName:string,database:string=this.DATABASE_NAME){
    const col = await this.getMongoClientWithCollection(database,collectionName)
    return col;
  }
  async aggregate(collectionName:string,aggregate:{}[],database:string = this.DATABASE_NAME){
    const col = await this.getMongoClientWithCollection(database,collectionName)
    return col.aggregate(aggregate);
  }




  private async getMongoClientWithCollection(database:string,collection:string){
    const app = new Realm.App({id:'svn-invite-jndfu'})
    let token = await this.jwt.generateToken()
    const credentials = Realm.Credentials.jwt(token)
    const user =await app.logIn(credentials)
    const mongo = app.currentUser.mongoClient(this.CLUSTER_NAME);
    const col = mongo.db(this.DATABASE_NAME).collection(collection??this.COLLECTION_NAME);
    return col
  }

}
