import { Injectable, inject } from '@angular/core';
import { MongoDbService } from './mongo-db.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { from } from 'rxjs';
import { BSON } from 'realm-web';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private collectionName: string = 'invitation'
  constructor(
    private mongoDb: MongoDbService,
    private commonService: CommonService
  ) { }

  save(document: Invitation) {
    return this.mongoDb.insertOne(this.collectionName, document)
  }
  delete() {

  }
  async getAll(skip: number, limit: number): Promise<Invitation[]> {
    // console.log("calling the service ");
    this.commonService.loaderShow()
    let data = await this.mongoDb.findAll(this.collectionName, [{ "$skip": skip }, { "$limit": limit }])
    this.commonService.loaderHide()
    // console.log("data", data);
    return data;
  }
  get() {

  }
  async search(column: string, keyword: string) {
    let col = await this.mongoDb.getCollection(this.collectionName);
    let data = (await col.find({ [column]: { $regex: keyword, $options: 'i' } }, { limit: 10, projection: { [column]: 1 } })).map(data => data[column])
    return data
  }
  async multiSearch(columnValues) {
    console.log(columnValues);

    let col = await this.mongoDb.getCollection(this.collectionName);
    let searchObject = {}
    for (const property in columnValues) {
      if (columnValues[property]) {
        searchObject[property] = { $regex: columnValues[property], $options: 'i' }
      }
    }
    console.log(searchObject);
    let data = await col.find(searchObject, { limit: 10 })
    console.log(data);

    return data
  }

  async update(document: {}) {
    let col = await this.mongoDb.getCollection(this.collectionName)
    let data = col.updateOne({ _id: new BSON.ObjectID(document["_id"]) }, document)
    return data
  }
  async saveMany(document: {}[]) {
    let data = await this.mongoDb.insertMany(this.collectionName, document)
    return data;
  }
  async getCount() {
    let aggregateResults = await this.mongoDb.aggregate(this.collectionName, [{ "$count": "name" }])
    // console.log(aggregateResults);
    return aggregateResults


  }
  async getGroupByCityInvitations() {
    let aggregateResults = await this.mongoDb.aggregate(this.collectionName, [{ $group: { _id: "$place", invitationCount: { $sum: 1 } } },{$sort:{invitationCount:-1}}])
    return aggregateResults
  }
  async getGroupByCityInvitationsPeopleCount() {
    let aggregateResults = await this.mongoDb.aggregate(this.collectionName, [{ $group: { _id: "$place", invitationCount: { $sum: "$count" } } },{$sort:{invitationCount:-1}}])
    return aggregateResults
  }
  async groupByCompleted() {
    let aggregateResults = await this.mongoDb.aggregate(this.collectionName, [{ $group: { _id: "$completed", invitationCount: { $sum: 1 } } }])
    return aggregateResults
  }
  async groupByCityAndCompleted() {
    let aggregateResults = await this.mongoDb.aggregate(this.collectionName, [{ $group: { _id: { place: "$place", completed: "$completed" }, invitationCount: { $sum: 1 } } }])
    return aggregateResults;
  }



}
export interface Invitation {
  fname: string
  mobile: number
  date: string
  completed: boolean
  place: string
  count: number
}
export const invitationResolver = (route: ActivatedRouteSnapshot) => {
  const dataService = inject(InvitationService)
  return from(dataService.getAll(0, 5))
}
