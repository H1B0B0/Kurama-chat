import request from 'supertest';
import express from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import { router as roomRoutes } from '../routes/roomRoutes';
import { Room } from '../models/room';

const app = express();
app.use(express.json());
app.use('/rooms', roomRoutes);

describe('GET /rooms', () => {
  it('should fetch all rooms', async () => {
    const mockRooms = [{ title: 'Global Chatroom', id: '1' }];
    sinon.stub(Room, 'find').resolves(mockRooms);

    const res = await request(app).get('/rooms');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockRooms);

    sinon.restore();
  });
});

describe('GET /rooms/all', () => {
  it('should fetch all rooms from the database', async () => {
    const mockRooms = [{ title: 'Global Chatroom', id: '1' }];
    sinon.stub(Room, 'find').resolves(mockRooms);

    const res = await request(app).get('/rooms/all');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockRooms);

    sinon.restore();
  });
});

describe('GET /rooms/:roomId', () => {
  it('should fetch a specific room by id', async () => {
    const mockRoom = { title: 'Global Chatroom', id: '1' };
    sinon.stub(Room, 'find').resolves([mockRoom]);

    const res = await request(app).get('/rooms/1');
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal(mockRoom);

    sinon.restore();
  });
});