const chai = require("chai");
const io = require("socket.io-client");
const expect = chai.expect;
const { server, io: socketIo } = require("../config/socket");
let socket;

describe("Socket.IO Server", () => {
  before((done) => {
    if (!server.listening) {
      server.listen(3000, done);
    } else {
      done();
    }
  });

  after((done) => {
    socketIo.close();
    server.close(() => done());
  });

  beforeEach((done) => {
    socket = io.connect("http://localhost:3000", {
      query: { userId: "user1" },
      reconnection: false,
    });
    socket.on("connect", done);
  });

  afterEach((done) => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it("should emit 'getOnlineUsers' event on connection", (done) => {
    socket.once("getOnlineUsers", (data) => {
      expect(data).to.be.an("array");
      expect(data).to.include("user1");
      done();
    });
  });
});
