/* eslint-disable camelcase */
import type {
    Device as ZHDevice,
    Group as ZHGroup,
    Endpoint as ZHEndpoint,
} from 'zigbee-herdsman/dist/controller/model';

import type {
    NetworkParameters as ZHNetworkParameters,
    CoordinatorVersion as ZHCoordinatorVersion,
    LQI as ZHLQI,
    RoutingTable as ZHRoutingTable,
    RoutingTableEntry as ZHRoutingTableEntry,
} from 'zigbee-herdsman/dist/adapter/tstype';

import type {
    Cluster as ZHCluster,
} from 'zigbee-herdsman/dist/zcl/tstype';

import type TypeEventBus from 'lib/eventBus';
import type TypeMQTT from 'lib/mqtt';
import type TypeState from 'lib/state';
import type TypeZigbee from 'lib/zigbee';
import type TypeDevice from 'lib/model/device';
import type TypeGroup from 'lib/model/group';
import type TypeExtension from 'lib/extension/extension';

import type mqtt from 'mqtt';

declare global {
    // Define some class types as global
    type EventBus = TypeEventBus;
    type MQTT = TypeMQTT;
    type Zigbee = TypeZigbee;
    type Group = TypeGroup;
    type Device = TypeDevice;
    type State = TypeState;
    type Extension = TypeExtension;

    type RecursivePartial<T> = {[P in keyof T]?: RecursivePartial<T[P]>;};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface KeyValue {[s: string]: any}

    // zigbee-herdsman
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace zh {
        type Endpoint = ZHEndpoint;
        type Device = ZHDevice;
        type Group = ZHGroup;
        type LQI = ZHLQI;
        type RoutingTable = ZHRoutingTable;
        type RoutingTableEntry = ZHRoutingTableEntry;
        type CoordinatorVersion = ZHCoordinatorVersion;
        type NetworkParameters = ZHNetworkParameters;
        type Cluster = ZHCluster;
        interface Bind {
            cluster: zh.Cluster;
            target: zh.Endpoint | zh.Group;
        }
    }

    interface MQTTOptions {qos?: mqtt.QoS, retain?: boolean, properties?: {messageExpiryInterval: number}}
    type StateChangeReason = 'publishDebounce' | 'group_optimistic';
    type PublishEntityState = (entity: Device | Group, payload: KeyValue,
        stateChangeReason?: StateChangeReason) => Promise<void>;

    // TODO below

    // eslint-disable camelcase
    interface Settings {
        homeassistant?: boolean,
        devices?: {[s: string]: {friendly_name: string, retention?: number}},
        groups?: {[s: string]: {friendly_name: string, devices?: string[]}},
        passlist: string[],
        blocklist: string[],
        whitelist: string[],
        ban: string[],
        availability?: boolean | {
            active?: {timeout?: number},
            passive?: {timeout?: number}
        },
        permit_join: boolean,
        frontend?: {
            auth_token?: string,
            host?: string,
            port?: number,
        },
        mqtt: {
            base_topic: string,
            include_device_information: boolean,
            force_disable_retain: boolean
            version?: number,
            user?: string,
            password?: string,
            server: string,
            ca?: string,
            keepalive?: number,
            key?: string,
            cert?: string,
            client_id?: string,
            reject_unauthorized?: boolean,
        },
        serial: {
            disable_led?: boolean,
            port?: string,
            adapter?: 'deconz' | 'zstack' | 'ezsp' | 'zigate'
        },
        device_options: {[s: string]: unknown},
        map_options: {
            graphviz: {
                colors: {
                    fill: {
                        enddevice: string,
                        coordinator: string,
                        router: string,
                    },
                    font: {
                        coordinator: string,
                        router: string,
                        enddevice: string,
                    },
                    line: {
                        active: string,
                        inactive: string,
                    },
                },
            },
        },
        experimental: {
            output: 'json' | 'attribute' | 'attribute_and_json',
            availability_new?: boolean,
            transmit_power?: number,
        },
        advanced: {
            legacy_api: boolean,
            log_rotation: boolean,
            log_symlink_current: boolean,
            log_output: ('console' | 'file' | 'syslog')[],
            log_directory: string,
            log_file: string,
            log_level: 'debug' | 'info' | 'error' | 'warn',
            log_syslog: KeyValue,
            soft_reset_timeout: number,
            pan_id: number | 'GENERATE',
            ext_pan_id: number[],
            channel: number,
            adapter_concurrent: number | null,
            adapter_delay: number | null,
            availability_timeout: number,
            availability_blocklist: string[],
            availability_passlist: string[],
            availability_blacklist: string[],
            availability_whitelist: string[],
            cache_state: boolean,
            cache_state_persistent: boolean,
            cache_state_send_on_startup: boolean,
            last_seen: 'disable' | 'ISO_8601' | 'ISO_8601_local' | 'epoch',
            elapsed: boolean,
            network_key: number[] | 'GENERATE',
            report: boolean,
            homeassistant_discovery_topic: string,
            homeassistant_status_topic: string,
            homeassistant_legacy_entity_attributes: boolean,
            homeassistant_legacy_triggers: boolean,
            timestamp_format: string,
            baudrate?: number,
            rtscts?: boolean,
            ikea_ota_use_test_url?: boolean,
        },
        ota: {
            update_check_interval: number,
            disable_automatic_update_check: boolean
        },
        external_converters: string[],
    }

    interface DeviceSettings {
        friendlyName: string,
        ID: string,
        retention?: number,
        availability?: boolean | {timeout: number},
        optimistic?: boolean,
        retrieve_state?: boolean,
        debounce?: number,
        debounce_ignore?: string[],
        filtered_optimistic?: string[],
        icon?: string,
        homeassistant?: KeyValue,
        legacy?: boolean,
        filtered_attributes?: string[],
    }

    interface GroupSettings {
        friendlyName: string,
        devices: string[],
        ID: string,
        optimistic?: boolean,
        filtered_optimistic?: string[],
        retrieve_state?: boolean,
        homeassistant?: KeyValue,
        filtered_attributes?: string[],
    }

    type EntitySettings = {
        type: 'device' | 'group'
        ID: string,
        friendlyName: string,
    };

    interface ResolvedEntity {
        type: 'device' | 'group',
        device: zh.Device,
        name: string,
    }

    interface ToZigbeeConverterGetMeta {message?: KeyValue, mapped?: Definition | Definition[]}

    interface ToZigbeeConverterResult {state: KeyValue,
        membersState: {[s: string]: KeyValue}, readAfterWriteTime?: number}

    interface ToZigbeeConverter {
        key: string[],
        convertGet?: (entity: zh.Endpoint | zh.Group, key: string, meta: ToZigbeeConverterGetMeta) => Promise<void>
        convertSet?: (entity: zh.Endpoint | zh.Group, key: string, value: unknown,
            meta: {state: KeyValue}) => Promise<ToZigbeeConverterResult>
    }

    // interface Logger {
    //     error: (message: string) => void;
    //     warn: (message: string) => void;
    //     debug: (message: string) => void;
    //     info: (message: string) => void;
    // }

    interface FromZigbeeConverter {
        cluster: string,
        type: string[] | string,
        convert: (model: Definition, msg: KeyValue, publish: (payload: KeyValue) => void, options: KeyValue,
            meta: {state: KeyValue, logger: unknown, device: zh.Device}) => KeyValue,
    }

    interface DefinitionExposeFeature {name: string, endpoint?: string,
        property: string, value_max?: number, value_min?: number,
        value_off?: string, value_on?: string, value_step?: number, values: string[], access: number}

    interface DefinitionExpose {
        type: string, name?: string, features?: DefinitionExposeFeature[],
        endpoint?: string, values?: string[], value_off?: string, value_on?: string,
        access: number, property: string, unit?: string,
        value_min?: number, value_max?: number}

    interface Definition {
        model: string
        endpoint?: (device: zh.Device) => {[s: string]: number}
        toZigbee: ToZigbeeConverter[]
        fromZigbee: FromZigbeeConverter[]
        icon?: string
        description: string
        vendor: string
        exposes: DefinitionExpose[] // TODO
        configure?: (device: zh.Device, coordinatorEndpoint: zh.Endpoint, logger: unknown) => Promise<void>;
        onEvent?: (type: string, data: KeyValue, device: zh.Device, settings: KeyValue) => Promise<void>;
        ota?: {
            isUpdateAvailable: (device: zh.Device, logger: unknown, data?: KeyValue) => Promise<boolean>;
            updateToLatest: (device: zh.Device, logger: unknown,
                onProgress: (progress: number, remaining: number) => void) => Promise<void>;
        }
    }

    interface ExternalConverterClass {
        // eslint-disable-next-line
        new(zigbee: Zigbee, mqtt: MQTT, state: State, publishEntityState: PublishEntityState,
            eventBus: EventBus, settings: unknown, logger: unknown): ExternalConverterClass;
    }

    interface MQTTResponse {data: KeyValue, status: string, error?: string, transaction?: string}
}
