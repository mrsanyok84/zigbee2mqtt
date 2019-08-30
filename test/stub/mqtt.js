const events = {};

const mock = {
    publish: jest.fn().mockImplementation((topic, payload, options, cb) => cb()),
    end: jest.fn(),
    on: (type, handler) => {
        if (type === 'connect') {
            handler();
        }

        events[type] = handler
    },
};

const mockConnect = jest.fn().mockReturnValue(mock);

jest.mock('mqtt', () => {
  return {connect: mockConnect};
});

module.exports = {
    events, ...mock, connect: mockConnect,
};