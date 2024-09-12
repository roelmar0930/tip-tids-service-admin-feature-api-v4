const supertest = require ('supertest')
const { MongoMemoryServer } = require ("mongodb-memory-server")
const app = require ("../../app")
const mongoose = require('mongoose')

const taskPayload = {
    title: "task #1",
    detail: "this is a new task for a new user",
    pictureUrl: "sample url",
    optionalInd: false,
    dueDateTime: "2023-12-25T13:34:00.000",
    createdBy:"21315092",
    updatedDate: null,
    updatedBy: null,
    importance:"Low"
};

describe('overview', () => {
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });
    describe('get upcoming events count', () => {
        describe('given that there are 14 events', () => {
            it('should return 14', async () => {
                const { body, statusCode } = await supertest(app).get(`/overview/getUpcomingEventsCount`)
                expect(statusCode).toBe(200)
                expect(body).toBe(14)
            })
        })
    });
    describe('get upcoming tasks count by Id', () => {
        describe('given that there are 6 pending tasks', () => {
            it('should return 6', async () => {
                const id = "10204981";
                const { body, statusCode } = await supertest(app).get(`/overview/getPendingTasksCountById/${id}`)
                expect(statusCode).toBe(200)
                expect(body).toEqual(6)
            })
        })
        describe('given that the user id does not exist', () => {
            it('should return 0', async () => {
                const id = "10203040";
                const { body, statusCode } = await supertest(app).get(`/overview/getPendingTasksCountById/${id}`)
                expect(statusCode).toBe(200)
                expect(body).toEqual(0)
            })
        })
    })
    describe('get tasks by Id', () => {
        describe('given that user has 6 tasks', () => {
            it('should just return 5 tasks', async () => {
                const id = "10204981";
                const { body, statusCode } = await supertest(app).get(`/overview/getTasksById/${id}`)
                expect(statusCode).toBe(200)
                expect(body).toEqual(
                [
                        {"createdBy": "10204981", "createdDate": "2023-03-21T04:53:33.814Z", "detail": "this is my task #11", "dueDateTime": "2023-03-01T18:34:00.000Z", "importance": "Low", "optionalInd": "false", "pictureUrl": "sample url", "taskReminderId": expect.any(String), "title": "task #66621", "updatedBy": null, "updatedDate": null}, 
                        {"createdBy": "10204981", "createdDate": "2023-03-17T08:19:06.313Z", "detail": "this is my task #5", "dueDateTime": "2023-03-29T17:34:00.000Z", "importance": "Low", "optionalInd": "false", "pictureUrl": "sample url", "taskReminderId": expect.any(String), "title": "task #5", "updatedBy": null, "updatedDate": null}, 
                        {"createdBy": "10204981", "createdDate": "2023-03-17T08:17:19.888Z", "detail": "this is a my task", "dueDateTime": "2023-03-29T17:34:00.000Z", "importance": "Low", "optionalInd": "true", "pictureUrl": "sample url", "taskReminderId": expect.any(String), "title": "task #1", "updatedBy": null, "updatedDate": null}, 
                        {"createdBy": "10204981", "createdDate": "2023-03-17T12:35:22.912Z", "detail": "this is my task #11", "dueDateTime": "2023-03-29T17:34:00.000Z", "importance": "Low", "optionalInd": "false", "pictureUrl": "sample url", "taskReminderId": expect.any(String), "title": "task #11", "updatedBy": null, "updatedDate": null}, 
                        {"createdBy": "10204981", "createdDate": "2023-03-21T04:53:13.074Z", "detail": "this is my task #11", "dueDateTime": "2023-04-29T17:34:00.000Z", "importance": "Low", "optionalInd": "false", "pictureUrl": "sample url", "taskReminderId": expect.any(String), "title": "task #11111", "updatedBy": null, "updatedDate": null}
                ])
            })
        })
        describe('given that the id does not exist', () => {
            it('should just return 0 tasks', async () => {
                const id = "10209999";
                const { body, statusCode } = await supertest(app).get(`/overview/getTasksById/${id}`)
                expect(statusCode).toBe(200)
                expect(body).toEqual([])
            })
        })
    })
    describe('post a task', () => {
        describe('given a user id', () => {
            it('it should create a task', async () => {
                const { statusCode, body } = await supertest(app).post("/overview/addTask").send(taskPayload);

                expect(statusCode).toBe(200);

                expect(body).toEqual({
                    createdDate: expect.any(String),
                    title: "task #1",
                    detail: "this is a new task for a new user",
                    pictureUrl: "sample url",
                    optionalInd: "false",
                    dueDateTime: "2023-12-25T18:34:00.000Z",
                    createdBy:"21315092",
                    updatedDate: null,
                    updatedBy: null,
                    importance:"Low",
                    taskReminderId: expect.any(String)
                });
            })
        })
    })
    describe('get upcoming events', () => {
        describe('given that there many events', () => {
            it('should just return 5 events', async () => {
                const { body, statusCode } = await supertest(app).get(`/overview/getEvents`)
                expect(statusCode).toBe(200)
                expect(body).toEqual(
                    [
                        {"category": "sample category 1", "code": "EX0001", "createdAt": expect.any(String), "createdBy": "sample 1", "detail": "sample detail 1", "endDate": "2023-03-20T04:00:00.000Z", "endTime": "2023-03-20T14:00:00.000Z", "eventId": 111111, "pictureUrl": "sample event pic url 1", "postEventSurveyURL": "sample post event survey url 1", "starsNum": 3, "startDate": "2023-03-20T04:00:00.000Z", "startTime": "2023-03-20T11:00:00.000Z", "title": "sample event 1", "updatedAt": null, "updatedBy": null, "venue": "sample venue 1", "venueDetails": "sample venue details 1"}, 
                        {"category": "sample category 5", "code": "EX0002", "createdAt": expect.any(String), "createdBy": "sample 5", "detail": "sample detail 5", "endDate": "2023-03-21T04:00:00.000Z", "endTime": "2023-03-21T14:00:00.000Z", "eventId": 555555, "pictureUrl": "sample event pic url 5", "postEventSurveyURL": "sample post event survey url 5", "starsNum": 3, "startDate": "2023-03-21T04:00:00.000Z", "startTime": "2023-03-21T11:00:00.000Z", "title": "sample event 5", "updatedAt": null, "updatedBy": null, "venue": "sample venue 5", "venueDetails": "sample venue details 5"}, 
                        {"category": "sample category 4", "code": "EX0002", "createdAt": expect.any(String), "createdBy": "sample 4", "detail": "sample detail 4", "endDate": "2023-03-21T04:00:00.000Z", "endTime": "2023-03-21T14:00:00.000Z", "eventId": 444444, "pictureUrl": "sample event pic url 4", "postEventSurveyURL": "sample post event survey url 4", "starsNum": 3, "startDate": "2023-03-21T04:00:00.000Z", "startTime": "2023-03-21T11:00:00.000Z", "title": "sample event 4", "updatedAt": null, "updatedBy": null, "venue": "sample venue 4", "venueDetails": "sample venue details 4"}, 
                        {"category": "sample category 3", "code": "EX0002", "createdAt": expect.any(String), "createdBy": "sample 3", "detail": "sample detail 3", "endDate": "2023-03-21T04:00:00.000Z", "endTime": "2023-03-21T14:00:00.000Z", "eventId": 333333, "pictureUrl": "sample event pic url 3", "postEventSurveyURL": "sample post event survey url 3", "starsNum": 3, "startDate": "2023-03-21T04:00:00.000Z", "startTime": "2023-03-21T11:00:00.000Z", "title": "sample event 3", "updatedAt": null, "updatedBy": null, "venue": "sample venue 3", "venueDetails": "sample venue details 3"}, 
                        {"category": "sample category 2", "code": "EX0002", "createdAt": expect.any(String), "createdBy": "sample 2", "detail": "sample detail 2", "endDate": "2023-03-21T04:00:00.000Z", "endTime": "2023-03-21T14:00:00.000Z", "eventId": 222222, "pictureUrl": "sample event pic url 2", "postEventSurveyURL": "sample post event survey url 2", "starsNum": 3, "startDate": "2023-03-21T04:00:00.000Z", "startTime": "2023-03-21T11:00:00.000Z", "title": "sample event 2", "updatedAt": null, "updatedBy": null, "venue": "sample venue 2", "venueDetails": "sample venue details 2"}
                    ]
                )
            })
        })
    })
    describe('get team member info by Id', () => {
        describe('given that id exists', () => {
            it('should return team member info', async () => {
                const id = "10204981";
                const { body, statusCode } = await supertest(app).get(`/overview/getTeamMemberInfoById/${id}`)
                expect(statusCode).toBe(200)
                expect(body).toEqual(
                [
                        {"cop": 5, "firstName": "Christopher", "immediateSupervisor": 10010586, "lastName": "Galapin", "middleName": "Gime", "slt": 10029360, "starsEarned": 999, "workEmail": "christopher.galapin@telusinternational.com", "workdayId": 10204981}
                ]
                )
            })
        })
        describe('given that id does not exist', () => {
            it('should return error', async () => {
                const id = "10204982";
                const { body, statusCode } = await supertest(app).get(`/overview/getTeamMemberInfoById/${id}`)
                expect(statusCode).toBe(404)
            })
        })
    })
})