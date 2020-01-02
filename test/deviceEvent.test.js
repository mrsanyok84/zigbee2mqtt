const data = require('./stub/data');
const logger = require('./stub/logger');
const zigbeeHerdsman = require('./stub/zigbeeHerdsman');
zigbeeHerdsman.returnDevices.push('0x00124b00120144ae');
zigbeeHerdsman.returnDevices.push('0x0017880104e45560');
const MQTT = require('./stub/mqtt');
const settings = require('../lib/util/settings');
const Controller = require('../lib/controller');
const flushPromises = () => new Promise(setImmediate);
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

const mocksClear = [MQTT.publish, logger.warn, logger.debug];

const zigbeeHerdsmanConverters = require('zigbee-herdsman-converters');
const mockOnEvent = jest.fn();
const mappedLivolo = zigbeeHerdsmanConverters.findByZigbeeModel(zigbeeHerdsman.devices.LIVOLO.modelID);
mappedLivolo.onEvent = mockOnEvent;

describe('Device event', () => {
    let controller;
    const device = zigbeeHerdsman.devices.LIVOLO;

    beforeEach(async () => {
        data.writeDefaultConfiguration();
        settings._reRead();
        data.writeEmptyState();
        controller = new Controller();
        await controller.start();
        mocksClear.forEach((m) => m.mockClear());
        await flushPromises();
    });

    it('Should call with start event', async () => {
        expect(mockOnEvent).toHaveBeenCalledTimes(1);
        const call = mockOnEvent.mock.calls[0];
        expect(call[0]).toBe('start')
        expect(call[1]).toStrictEqual({})
        expect(call[2]).toBe(device);
    });

    it('Should call with stop event', async () => {
        mockOnEvent.mockClear();
        await controller.stop();
        await flushPromises();
        expect(mockOnEvent).toHaveBeenCalledTimes(1);
        const call = mockOnEvent.mock.calls[0];
        expect(call[0]).toBe('stop')
        expect(call[1]).toStrictEqual({})
        expect(call[2]).toBe(device);
    });

    it('Should call with zigbee event', async () => {
        mockOnEvent.mockClear();
        await zigbeeHerdsman.events.deviceAnnounce({device});
        await flushPromises();
        expect(mockOnEvent).toHaveBeenCalledTimes(1);
        const call = mockOnEvent.mock.calls[0];
        expect(call[0]).toBe('deviceAnnounce')
        expect(call[1]).toStrictEqual({device})
        expect(call[2]).toBe(device);
    });
});
