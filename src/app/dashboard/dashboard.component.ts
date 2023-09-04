import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { CommonService } from 'src/services/common.service';
import { InvitationService } from 'src/services/invitation.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private invitationService: InvitationService,
    private commonService : CommonService
  ) { }
  chart: any = []
  groupByCity: any = []
  groupBycompleted: any = []
  groupBycityandCompleted: any=[]
  groupByCityPeopleCount:any=[]
  preparedGroupByCity;
  preparedGroupByCompleted;
  preparedGroupByCityPeopleCount;
  invitationsCompleted;
  totalInvitations;

  // photo
  photo = '../assets/group_new.jpg';
  photos=['../assets/group_new.jpg','../assets/child.jpg']
  // loader$
  index = 0
  ngOnInit(): void {
     setInterval(()=>{
        if (this.index < this.photos.length) {
          this.photo = this.photos[this.index++]
        }else{
          this.index =0
        }

      },2000)
    let groupByCityAndCompleted = [
      {
        "_id": {
          "place": "anan",
          "completed": false
        },
        "invitationCount": 1
      },
      {
        "_id": {
          "place": "Anantapur",
          "completed": false
        },
        "invitationCount": 8
      },
      {
        "_id": {
          "place": "rapthadu",
          "completed": true
        },
        "invitationCount": 1
      },
      {
        "_id": {
          "place": "Banglore",
          "completed": true
        },
        "invitationCount": 4
      },
      {
        "_id": {
          "place": "anantapur",
          "completed": false
        },
        "invitationCount": 2
      },
      {
        "_id": {
          "place": "Banglore",
          "completed": false
        },
        "invitationCount": 4
      },
      {
        "_id": {
          "place": "tadipathri",
          "completed": true
        },
        "invitationCount": 4
      }
    ]

     this.commonService.loaderShow()
    this.invitationService.groupByCompleted().then(data=>{
      this.preparedGroupByCompleted = this.prepareDoughnutData(data);
      this.groupBycompleted = this.prepareDoughnutChart('groupBycompleted', this.preparedGroupByCompleted, `Completed or Not`)
    })
    this.invitationService.getGroupByCityInvitations().then(data=>{
      this.preparedGroupByCity = this.prepareGroupByData(data)
      this.groupByCity = this.prepareGroupChart('groupBycity', this.preparedGroupByCity, `Invitations Per City [Total:${this.preparedGroupByCity.totalCount}]`)
    })
    this.invitationService.getGroupByCityInvitationsPeopleCount().then(
      data=>{
        this.preparedGroupByCityPeopleCount = this.prepareGroupByData(data)
        // console.log(this.preparedGroupByCityPeopleCount);

        this.groupByCityPeopleCount = this.prepareGroupChart('groupByCityPeopleCount',this.preparedGroupByCityPeopleCount,`Count of People By City [Total:${this.preparedGroupByCityPeopleCount['totalCount']}]`)
        this.commonService.loaderHide()
      }
    )
    this.commonService.loaderHide()
    this.groupBycityandCompleted = this.prepareStackedChart('groupBycityandCompleted',this.prepareGroupByStackedData(groupByCityAndCompleted))

  }
  prepareGroupChart(id, preparedGroupedData, label) {
    // let delayed = preparedGroupedData.delayed
    return new Chart(id, {
      type: 'bar',
      data: {
        labels: preparedGroupedData.lables,
        datasets: [
          {
            label: label,
            data: preparedGroupedData.data,
            backgroundColor: preparedGroupedData.colors,
            borderWidth: 1,
            borderColor: preparedGroupedData.borderColors
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {

          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
            }
          }
        },
        animation: {
          onComplete: () => {
            preparedGroupedData.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !preparedGroupedData.delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
      }
    })
  }
  prepareDoughnutChart(id, preparedGroupedData, label) {
    // let delayed = preparedGroupedData.delayed
    this.totalInvitations = preparedGroupedData.totalCount;

    return new Chart(id, {
      type: 'doughnut',
      data: {
        labels: preparedGroupedData.lables,
        datasets: [
          {
            label: `Invitation Status [Total: ${preparedGroupedData.totalCount}]`,
            data: preparedGroupedData.data,
            backgroundColor:['orange','blue'],
            borderWidth: 1,
            borderColor: preparedGroupedData.borderColors
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        animation: {
          onComplete: () => {
            preparedGroupedData.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !preparedGroupedData.delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
      }
    })
  }
  prepareStackedChart(id,preparedData){
    return new Chart(id,{
      type:'bar',
      data:{
        labels:[],
        datasets:preparedData
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'City and Completed Stack'
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    })
  }
  generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }
  prepareGroupByData(groupedData) {
    let labels = []
    let data = []
    let colors = []
    let borderColors = []
     let totalCount=0
    for (const element of groupedData) {
      labels.push(element['_id'].toString().toUpperCase())
      data.push(element['invitationCount'])
      colors.push(this.generateRandomColor())
      borderColors.push(this.generateRandomColor())
      totalCount +=element['invitationCount']
    }
    return { lables: labels, data: data, colors: colors, borderColors: borderColors,totalCount:totalCount }
  }
  prepareDoughnutData(groupedData){
    let labels = []
    let data = []
    let colors = []
    let borderColors = []
    let totalCount=0
    // this.invitationsCompleted =
    for (const element of groupedData) {
      console.log(element['_id']);
      if (element['_id']) {
        this.invitationsCompleted = element['invitationCount']
      }
      // this.invitationsCompleted = element['_id']?element['invitationCount']:
      labels.push(element['_id']?`Completed ${element['invitationCount']}`:`Not Completed ${element['invitationCount']}`)
      data.push(element['invitationCount'])
      colors.push(element['_id']?'red':'green')
      borderColors.push(this.generateRandomColor())
      totalCount+=Number(element['invitationCount'])
      console.log(totalCount);

    }
    console.log(totalCount);

    return { lables: labels, data: data, colors: colors, borderColors: borderColors,totalCount:totalCount }

  }
  prepareGroupByStackedData(groupedData) {
    let trueDataset = {
      label: 'Completed Invitations',
      data: [],
      backgroundColor: [],
      borderColor:[]
    }
    let falseDataset = {
      label: 'Not Completed Invitations',
      data: [],
      backgroundColor: [],
      borderColor:[]
    }
    for (const record of groupedData) {
      if (record['_id']['completed']) {
        trueDataset.data.push(record['invitationCount'])
        trueDataset.backgroundColor.push(this.generateRandomColor())
        trueDataset.borderColor.push(this.generateRandomColor())
      } else {
        falseDataset.data.push(record['invitationCount'])
        falseDataset.backgroundColor.push(this.generateRandomColor())
        falseDataset.borderColor.push(this.generateRandomColor())
      }
    }
    let dt =[trueDataset,falseDataset]
    console.log(dt);
    // return {"labels":,"dataset":dt};
  }
  getPercentage(){
    return Math.round(this.invitationsCompleted/this.totalInvitations*100);
  }


}
