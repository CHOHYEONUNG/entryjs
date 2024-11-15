'use strict';
const {Block_NepesAICarBase, PreAction} = require('./block_nepes_ai_car_base.js');

class Block_NepesAICar extends Block_NepesAICarBase {
	constructor() {
		super();

		this.id =  'FF.FF';
		this.name = 'NEPES AI Car';
		this.url = 'https://www.nepes.co.kr/';
		this.imageName = 'nepes_ai_car.png';
		this.title = {
			ko: 'AI 넷패스 카',
			en: 'NEPES AI Car',
		};
		this.blockMenuBlocks = this.getBlockMenuBlocks();
	}

	getBlockMenuBlocks() {
		return [
			// Nepes Car flow
			'nepes_car_set_speed',
			'nepes_car_move',
			'nepes_car_time_to_move',
			'nepes_car_each_move',
			'nepes_car_linetracing',
			'nepes_car_read_line_value',
			'nepes_car_read_line_value_is',

			// Nepes Car LED control
			'nepes_car_select_led_colors',
			'nepes_car_led_off',
			'nepes_car_set_led_colors',

			// Nepes Car sensors
			'nepes_car_read_light_value',
			'nepes_car_set_light_value_is',

			'nepes_car_read_color_value',
			'nepes_car_read_color_value_is',
			'nepes_car_read_color_RGB_value',

			'nepes_car_read_distance',
			'nepes_car_is_object_dected',
			'nepes_car_read_distance_is',

			// AI command
			'nepes_car_ai_request_voice_trigger',
			'nepes_car_ai_request_tts',
			'nepes_car_ai_request_tts_waiting',
			'nepes_car_ai_request_sound_stop',
			'nepes_car_ai_set_volume',
			'nepes_car_ai_request_alert',
		];
	}

	setLanguage() {
		return {
			ko: {
				template: {
					// Nepes Car flow
					nepes_car_set_speed : '속도를 %1 으로 정하기 %2',
					nepes_car_move : '%1 하기 %2',
					nepes_car_time_to_move : '%1 초 동안 %2 하기 %3',
					nepes_car_each_move : '왼쪽 바퀴를 %1 %2 속도로, 오른쪽 바퀴를 %3 %4 속도로 회전 %5',
					nepes_car_linetracing : '라인 트레이싱 %1 %2',
					nepes_car_read_line_value : '라인 트레이싱 %1 값 %2',
					nepes_car_read_line_value_is : '%1 라인 센서에 감지된 색이 %2 일때 %3',

					// Nepes Car LED control
					nepes_car_select_led_colors : '%1 전조등을 %2 으로 정하기 %3',
					nepes_car_led_off : '%1 전조등 끄기 %2',
					nepes_car_set_led_colors : '%1 전조등 색깔을 빨간색: %2 녹색: %3 파란색: %4 %5',

					// Nepes Car sensors
					nepes_car_read_light_value : '%1 빛센서 값 %2',
					nepes_car_set_light_value_is : '%1 빛센서 값 %2 %3 일 때 %4',

					nepes_car_read_color_value : '컬러센서의 색깔이 %1 인가? %2',
					nepes_car_read_color_value_is : '컬러센서의 색깔이 %1 일때 %2',
					nepes_car_read_color_RGB_value : '컬러센서 %1 값 %2',

					nepes_car_read_distance : '거리 센서 값 %1 %2',
					nepes_car_is_object_dected : '거리 센서에 물체가 감지되었나? %1',
					nepes_car_read_distance_is : '물체까지 거리 %1 %2 cm 일 때 %3',

					// AI command
					nepes_car_ai_request_voice_trigger : '넷패스 카에 음성 명령어 전달하기 %1',
					nepes_car_ai_request_tts : '스피커가 %1 말하기 %2',
					nepes_car_ai_request_tts_waiting : '스피커가 %1 말하고 기다리기 %2',
					nepes_car_ai_request_sound_stop : '스피커 소리 멈추기 %1',
					nepes_car_ai_set_volume : '스피커 소리 크기 %1 %로 정하기 %2',
					nepes_car_ai_request_alert : '스피커에서 %1 소리 나기 %2',
				},
			},
			en: {
				template: {
					// Nepes Car flow
					nepes_car_set_speed : '속도를 %1 으로 정하기 %2',
					nepes_car_move : '%1 하기 %2',
					nepes_car_time_to_move : '%1 초 동안 %2 하기 %3',
					nepes_car_each_move : '왼쪽 바퀴를 %1 %2 속도로, 오른쪽 바퀴를 %3 %4 속도로 회전 %5',
					nepes_car_linetracing : '라인 트레이싱 %1 %2',
					nepes_car_read_line_value : '라인 트레이싱 %1 값 %2',
					nepes_car_read_line_value_is : '%1 라인 센서에 감지된 색이 %2 일때 %3',

					// Nepes Car LED control
					nepes_car_select_led_colors : '%1 전조등을 %2 으로 정하기 %3',
					nepes_car_led_off : '%1 전조등 끄기 %2',
					nepes_car_set_led_colors : '%1 전조등 색깔을 빨간색: %2 녹색: %3 파란색: %4 %5',

					// Nepes Car sensors
					nepes_car_read_light_value : '%1 빛센서 값 %2',
					nepes_car_set_light_value_is : '%1 빛센서 값 %2 %3 일 때 %4',
					nepes_car_read_color_RGB_value : '컬러센서 %1 값 %2',

					nepes_car_read_color_value : '컬러센서의 색깔이 %1 인가? %2',
					nepes_car_read_color_value_is : '컬러센서의 색깔이 %1 일때 %2',

					nepes_car_read_distance : '거리 센서 값 %1 %2',
					nepes_car_is_object_dected : '거리 센서에 물체가 감지되었나? %1',
					nepes_car_read_distance_is : '물체까지 거리 %1 %2 cm 일 때 %3',

					// AI command
					nepes_car_ai_request_voice_trigger : '넷패스 카에 음성 명령어 전달하기 %1',
					nepes_car_ai_request_tts : '스피커가 %1 말하기 %2',
					nepes_car_ai_request_tts_waiting : '스피커가 %1 말하고 기다리기 %2',
					nepes_car_ai_request_sound_stop : '스피커 소리 멈추기 %1',
					nepes_car_ai_set_volume : '스피커 소리 크기 %1 %로 정하기 %2',
					nepes_car_ai_request_alert : '스피커에서 %1 소리 나기 %2',
				},
			},
		};
	}

	getBlocks() {
		return {
			// Nepes Car flow
			nepes_car_set_speed: {	// '속도를 %1 으로 정하기 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Block',
						accept: 'string',
						defaultType: 'number',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_set_speed',
				},
				paramsKeyMap: {
                    SPEED_VALUE: 0,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_set_motor_speed(sprite, script)
			},

			nepes_car_move: {	// '%1 하기 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['앞으로 이동', 	'forward'],
                            ['뒤로 이동', 		'backward'],
							['왼쪽으로 회전', 	'turnLeft'],
							['오른쪽으로 회전', 	'turnRight'],
							['정지', 			'stop']
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_move',
				},
				paramsKeyMap: {
                    MOVE_ACTION: 0,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_move(sprite, script)
			},

			nepes_car_time_to_move: {	// '%1 초 동안 %2 하기 %3',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Block',
						accept: 'string',
						defaultType: 'number',
					},
					{
						type: 'Dropdown',
                        options: [
                            ['앞으로 이동', 	'forward'],
                            ['뒤로 이동', 		'backward'],
							['왼쪽으로 회전', 	'turnLeft'],
							['오른쪽으로 회전', 	'turnRight'],
							['정지', 			'stop']
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null],
					type: 'nepes_car_time_to_move',
				},
				paramsKeyMap: {
					MOVE_TIME: 0,
                    MOVE_ACTION: 1,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_time_to_move(sprite, script)
			},

			nepes_car_each_move: {	// '왼쪽 바퀴를 %1 %2 속도로, 오른쪽 바퀴를 %3 %4 속도로 회전 %5',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['앞으로', 	'forward'],
                            ['뒤로', 		'backward'],
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Block',
						accept: 'string',
						defaultType: 'number',
					},
					{
						type: 'Dropdown',
                        options: [
                            ['앞으로', 	'forward'],
                            ['뒤로', 		'backward'],
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Block',
						accept: 'string',
						defaultType: 'number',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null, null, null],
					type: 'nepes_car_each_move',
				},
				paramsKeyMap: {
					LEFT_MOVE_DIRECTION: 0,
                    LEFT_MOVE_SPEED: 1,
					RIGHT_MOVE_DIRECTION: 2,
					RIGHT_MOVE_SPEED: 3,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_each_move(sprite, script)
			},
			nepes_car_linetracing: {	// '라인 트레이싱 %1 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['하기', 		'start'],
                            ['멈추기', 	'stop'],
                        ],
                        value: 'start',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_linetracing',
				},
				paramsKeyMap: {
					LINETRACEING_ACTION: 0,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_linetracing(sprite, script)
			},

			nepes_car_read_line_value: { 	// '라인 트레이싱 %1 값 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_string_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'left'],
                            ['오른쪽', 	'right'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_read_line_value',
				},
				paramsKeyMap: {
					LINETRACING_VALUE: 0,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_read_linetracing_value(sprite, script)
			},

			nepes_car_read_line_value_is: { 	//'%1 라인 센서에 감지된 색이 %2 일때 %3',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_boolean_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'LEFT'],
                            ['오른쪽', 	'RIGHT'],
                        ],
                        value: 'LEFT',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Dropdown',
                        options: [
                            ['검은색', 	'BLACK'],
                            ['흰색', 		'WHITE'],
                        ],
                        value: 'BLACK',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null],
					type: 'nepes_car_read_line_value_is',
				},
				paramsKeyMap: {
					LINETRACING_DIRECTION: 0,
					LINETRACING_VALUE:1,
                },
				class: 'nepes_car_flow',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_read_linetracing_value_is(sprite, script)
			},

			// Nepes Car LED control
			nepes_car_select_led_colors: {	// '%1 전조등을 %2 으로 정하기 %3',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'left'],
                            ['오른쪽', 	'right'],
							['양쪽', 		'both'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Dropdown',
						options: [
							['빨간색', '#FF0000'],
							['주황색', '#FFA500'],
							['노랑색', '#FFFF00'],
							['초록색', '#008000'],
							['하늘색', '#00FFFF'],
							['파랑색', '#0000FF'],
							['보라색', '#800080'],
							['흰색', '#FFFFFF'],
						],
						value: '#FF0000',  // 기본 색상
						fontSize: 11,
						bgColor: EntryStatic.colorSet.block.darken.HARDWARE,  // 드롭다운 배경색
						arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null],
					type: 'nepes_car_select_led_colors',
				},
				paramsKeyMap: {
					LED_DIRECTION: 0,
					LED_COLOR_VALUE:1,
                },
				class: 'nepes_car_led_ctrl',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_set_led_control(sprite, script)
			},

			nepes_car_led_off: { 	// '%1 전조등 끄기 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'left'],
                            ['오른쪽', 	'right'],
							['양쪽', 		'both'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_led_off',
				},
				paramsKeyMap: {
					LED_DIRECTION: 0,
                },
				class: 'nepes_car_led_ctrl',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_set_led_off(sprite, script)
			},

			nepes_car_set_led_colors: {	// '%1 전조등 색깔을 빨간색: %2 녹색: %3 파란색: %4 %5',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'left'],
                            ['오른쪽', 	'right'],
							['양쪽', 		'both'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null, null, null],
					type: 'nepes_car_set_led_colors',
				},
				paramsKeyMap: {
					LED_DIRECTION: 0,
					LED_RED_VALUE : 1,
					LED_GREEN_VALUE: 2,
					LED_BLUE_VALUE: 3,
                },
				class: 'nepes_car_led_ctrl',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_set_led_detail_control(sprite, script)
			},

			// Nepes Car sensors
			nepes_car_read_light_value: {	// '%1 빛센서 값 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_string_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'left'],
                            ['오른쪽', 	'right'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_read_light_value',
				},
				paramsKeyMap: {
					LIGHT_DIRECTION: 0,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_light(sprite, script)
			},

			nepes_car_set_light_value_is: {	// '%1 빛센서 값 %2 %3 일 때 %4',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 		'left'],
                            ['오른쪽', 	'right'],
							['양쪽', 		'both'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Dropdown',
						options: [
							['=', 'EQUAL'],
							['>', 'GREATER'],
							['<', 'LESS'],
							['≥', 'GREATER_OR_EQUAL'],
							['≤', 'LESS_OR_EQUAL'],
						],
						value: 'GREATER',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_set_light_value_is',
				},
				paramsKeyMap: {
					LIGHT_DIRECTION: 0,
					LIGHT_VALUE_MEASURE: 1,
					LIGHT_VALUE:2,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_light_value_is(sprite, script)
			},

			nepes_car_read_color_value: {	// '컬러센서의 색깔이 %1 인가? %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_boolean_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['빨간색', 	'RED'],
                            ['노란색', 	'YELLOW'],
							['녹색', 		'GREEN'],
							['파란색', 	'BLUE'],
							['보라색', 	'PURPLE'],
                        ],
                        value: 'RED',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_read_color_value',
				},
				paramsKeyMap: {
					COLOR_VALUE: 0,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_color_value(sprite, script)
			},

			nepes_car_read_color_value_is: { // '컬러센서의 색깔이 %1 일때 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['빨간색', 	'RED'],
                            ['노란색', 	'YELLOW'],
							['녹색', 		'GREEN'],
							['파란색', 	'BLUE'],
							['보라색', 	'PERPLE'],
                        ],
                        value: 'RED',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_read_color_value_is',
				},
				paramsKeyMap: {
					COLOR_VALUE: 0,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_color_value_is(sprite, script)
			},

			nepes_car_read_color_RGB_value: {	// '컬러센서 %1 값 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_string_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['빨간색', 	'RED'],
							['녹색', 		'GREEN'],
							['파란색', 	'BLUE'],
                        ],
                        value: 'RED',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_read_color_RGB_value',
				},
				paramsKeyMap: {
					COLOR_VALUE: 0,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_color_RGB_value(sprite, script)
			},

			nepes_car_read_distance: { // '거리 센서 값 %1 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_string_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['cm', 	'CM'],
                            ['mm', 	'MM'],
                        ],
                        value: 'CM',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_read_distance',
				},
				paramsKeyMap: {
					DISTANCE_VALUE: 0,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_distance(sprite, script)
			},

			nepes_car_is_object_dected: { 	// '거리 센서에 물체가 감지되었나? %1',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null],
					type: 'nepes_car_is_object_dected',
				},
				paramsKeyMap: {
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_object_detected(sprite, script)
			},

			nepes_car_read_distance_is: {	// '물체까지 거리 %1 %2 cm 일 때 #3',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
						options: [
							['=', 'EQUAL'],
							['>', 'GREATER'],
							['<', 'LESS'],
							['≥', 'GREATER_OR_EQUAL'],
							['≤', 'LESS_OR_EQUAL'],
						],
						value: 'LESS',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null],
					type: 'nepes_car_read_distance_is',
				},
				paramsKeyMap: {
					DISTANCE_VALUE_MEASURE: 0,
					DISTANCE_VALUE: 1,
                },
				class: 'nepes_car_sensors',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_sensor_read_light_value_is(sprite, script)
			},

			// AI command
			nepes_car_ai_request_voice_trigger: {	// '넷패스 카에 음성 명령어 전달하기 %1'
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null],
					type: 'nepes_car_ai_request_voice_trigger',
				},
				paramsKeyMap: {
					DISTANCE_VALUE_MEASURE: 0,
					DISTANCE_VALUE: 1,
                },
				class: 'nepes_car_ai_commands',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_voice_trigger(sprite, script)
			},

			nepes_car_ai_request_tts: {	// '스피커가 %1 말하기 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_ai_request_tts',
				},
				paramsKeyMap: {
					TTS_VALUE: 0,
                },
				class: 'nepes_car_ai_commands',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_TTS(sprite, script)
			},

			nepes_car_ai_request_tts_waiting: {	// '스피커가 %1 말하고 기다리기 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_ai_request_tts_waiting',
				},
				paramsKeyMap: {
					TTS_VALUE: 0,
                },
				class: 'nepes_car_ai_commands',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_TTS_waiting(sprite, script)
			},

			nepes_car_ai_request_sound_stop: {	// '스피커 소리 멈추기 %1',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null],
					type: 'nepes_car_ai_request_sound_stop',
				},
				paramsKeyMap: {
                },
				class: 'nepes_car_ai_commands',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_stop_sound(sprite, script)
			},

			nepes_car_ai_set_volume: { 	// '스피커 소리 크기 %1 로 정하기 %2',
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Block',
						accept: 'string',
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_ai_set_volume',
				},
				paramsKeyMap: {
					SOUND_VOLUME: 0,
                },
				class: 'nepes_car_ai_commands',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_set_volume(sprite, script)
			},

			nepes_car_ai_request_alert: {	// '스피커에서 %1 소리 나기 %2'
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
						options: [
							['경적', 'HORN'],
							['딩동', 'DINGDONG'],
							['보너스', 'BONUS'],
							['클리어', 'CLEAR'],
						],
						value: 'HORN',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Indicator',
						img: 'block_icon/hardware_icon.svg',
						size: 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'nepes_car_ai_request_alert',
				},
				paramsKeyMap: {
					ALERT_ID: 0,
                },
				class: 'nepes_car_ai_commands',
				//isNotFor : ['NEPES AI Car'],
				func: (sprite, script) => this.req_nepes_car_ai_play_alert(sprite, script)
			},
		};
	};

    setZero () {
        super.setZero();
    }

    afterReceive (data) {
        super.afterReceive(data);
    }

    afterSend () {
        super.afterSend();
    }
}

module.exports = new Block_NepesAICar();
