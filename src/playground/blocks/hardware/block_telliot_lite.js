'use strict';
const {TelliotBase, PreAction} = require('./block_telliot_Base.js');

class TelliotLite extends TelliotBase {
	constructor() {
		super();

		this.id =  '60.1';
		this.name = 'GoldenKidsAICar';
		this.url = 'https://www.iotedcorp.com';
		this.imageName = 'telliot_lite.png';
		this.title = {
			ko: '금쪽이 카',
			en: 'GoldenKidsAICar',
		};
		this.blockMenuBlocks = this.getBlockMenuBlocks();
	}

	getBlockMenuBlocks() {
		return [
			// Telliot Car flow
			'telliot_car_move',
			'telliot_car_turn',
			'telliot_car_stop',
			'telliot_car_wheel_move',
			'telliot_car_line_move',

			// Telliot Car sensors
			'telliot_car_sensor_is_detected',
			'telliot_car_sensor_RFID_detect',
//			'telliot_car_camera_detect',

			// AI
//			'telliot_car_chatbot',
//			'telliot_car_voice_command',
			'telliot_car_voice_trigger',
//			'telliot_car_STT',
			'telliot_car_TTS',

			// AI prompt
//			'telliot_car_add_prompt',
//			'telliot_car_set_prompt'

			//nepes car
			'telliot_car_set_led_color',
			'telliot_car_led_off',
			'telliot_car_led_rgb_setting',
			'telliot_light_sensor_value'
		];
	}

	setLanguage() {
		return {
			ko: {
				template: {
					// Telliot Car flow
					telliot_car_move: '%1(으)로 %2초간 이동하기 %3',
					telliot_car_turn: '%1으로 회전하기 %2',
					telliot_car_stop: '현재 위치에서 정지하기 %1',
					//telliot_car_wheel_move: '%1 모터를 %2 만큼 %3으로 회전하기 %4',
					telliot_car_line_move : '라인을 따라 앞으로 이동 하기 %2',

					// Telliot Car sensors
					telliot_car_sensor_is_detected : '거리 센서가 물체를 %1 했을때 %2',
					telliot_car_sensor_RFID_detect : '태그가 %1모양이 감지되었을때 %2',
//					telliot_car_camera_detect : '카메라에 %1 되었을때 %2',

					// AI
//					telliot_car_chatbot : '%1 라고 말하면 %2라고 대답하기 %3',
//					telliot_car_voice_command : '%1라고 말하면 %2',
					telliot_car_voice_trigger: '금쪽이 스피커에 음성 명령어 전달하기 %1',
//					telliot_car_STT: '텔리엇에 전달한 음성을 문자로 전달 받기 %1',
					telliot_car_TTS: '%1을 금쪽이 스피커에서 듣기 %2',

					// AI prompt
					telliot_car_add_prompt : '%1 프롬프트 추가하기 %2',
//					telliot_car_set_prompt : '%1 프롬프트로 설정하기'

					//nepes_led
					telliot_car_set_led_color : '%1 전조등을 %2으로 바꾸기 %3',
					telliot_car_led_off : '%1 전조등 끄기 %2',
					telliot_car_led_rgb_setting : '%1 전조등 색깔설정 빨간색: %2 초록색: %3 파란색: %4 %5',

					//nepes light_sensor
					telliot_light_sensor_value : '%1 빛센서 값 %2',
					telliot_light_sensor_r : '%1 빛센서 %2 %3 일때 %4'

					//nepes_color_sensor
//					telliot_color_sensor_detect : '컬러센서의 색깔이 %1 인가?'
//					telliot_color_sensor_resource : '컬러센서 %1 값'

					//nepes_lange_sensor
//					telliot_lange_sensor_detect : '거리센서 값 %1'
//



				},
			},
			en: {
				template: {
					// Telliot Car flow
					telliot_car_move: 'Move %1 during %2sec %3',
					telliot_car_turn: 'Rotate %2 degree to the %1 %3',
					telliot_car_stop: 'Stop at current position %1',
					//telliot_car_wheel_move: '%1 모터를 %2 만큼 %3 회전하기 %4',
					telliot_car_line_move : '라인을 따라 앞으로 이동하기 %2',

					// Telliot Car sensors
					telliot_car_sensor_is_detected : ' 거리 센서가 %1 했을때 %2',
					telliot_car_sensor_RFID_detect : '태그가 %1모양이 감지 되었을때 %2',
//					telliot_car_camera_detect : '카메라에 %1 되었을때 %2',

					// AI
//					telliot_car_chatbot : '%1 라고 말하면 %2라고 대답하기 %3',
//					telliot_car_voice_command : '%1라고 말하면 %2',
					telliot_car_voice_trigger: 'Send voice command to Speaker %1',
//					telliot_car_STT: 'Receive speech to text from telliot %1',
					telliot_car_TTS: 'Speech from %1 %2',

					// AI prompt
//					telliot_car_add_prompt : 'Add %1 prompt %2',
//					telliot_car_set_prompt : 'Set %1 prompt'

					//nepes_led
					telliot_car_set_led_color : '%1 전조등을 %2으로 바꾸기 %3',
					telliot_car_led_off : '%1 전조등 끄기 %2'
//					telliot_car_led_rgb_setting : '%1 전조등 색깔설정 빨간색: %2 초록색: %3 파란색: %4 %5'

					//nepes light_sensor
//					telliot_light_sensor : '%1 빛센서 값'

					//nepes_color_sensor
//					telliot_color_sensor_detect : '컬러센서의 색깔이 %1 인가?'
//					telliot_color_sensor_resource : '컬러센서 %1 값'

					//nepes_lange_sensor
//					telliot_lange_sensor_detect : '거리센서 값 %1'
				},
			},
		};
	}

	getBlocks() {
		return {
			// Telliot Car flow
			telliot_car_move : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['앞', 'forward'],
                            ['뒤', 'backward'],
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type: 'Dropdown',
                        options: [
                            ['1', '1'],
                            ['2', '2'],
                            ['3', '3'],
                            ['4', '4'],
                            ['5', '5'],
                        ],
                        value: '1',
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
					type: 'telliot_car_move',
				},
				paramsKeyMap: {
                    PREDEFINED_MOTION_ID: 0,
					PREDEFINED_MOTION_VALUE: 1,
                },
				class: 'telliot_car_flow',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_predefined_action(sprite, script)
			},

			telliot_car_turn : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['왼쪽', 'left'],
                            ['오른쪽', 'right'],
                        ],
                        value: 'left',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					// {
					// 	type: 'Dropdown',
                    //     options: [
                    //         ['15', '15'],
                    //         ['30', '30'],
                    //         ['45', '45'],
                    //         ['60', '60'],
                    //         ['75', '75'],
                    //         ['90', '90'],
                    //         ['105', '105'],
                    //         ['120', '120'],
                    //         ['135', '135'],
                    //         ['150', '150'],
                    //         ['165', '165'],
                    //         ['180', '180'],
                    //     ],
                    //     value: '45',
                    //     fontSize: 11,
                    //     bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                    //     arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					// },
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [null, null, null],
					type: 'telliot_car_turn',
				},
				paramsKeyMap: {
                    PREDEFINED_MOTION_ID: 0,
					PREDEFINED_MOTION_VALUE: 1,
                },
				class: 'telliot_car_flow',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_predefined_action(sprite, script)
			},

			telliot_car_stop: {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params: [null],
					type: 'telliot_car_stop',
				},
				class: 'telliot_car_flow',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_action_stop(sprite, script)
			},

			// telliot_car_wheel_move : {
			// 	color: EntryStatic.colorSet.block.default.HARDWARE,
			// 	outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
			// 	skeleton: 'basic',
			// 	statements: [],
			// 	params: [
			// 		{
			// 			type: 'Dropdown',
            //             options: [
            //                 ['왼쪽 바퀴', 'left wheel'],
            //                 ['오른쪽 바퀴', 'right wheel'],
            //             ],
            //             value: 'left wheel',
            //             fontSize: 11,
            //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
            //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
			// 		},
			// 		{
            //             type: 'Block',
            //             accept: 'string',
			// 			defaultType: 'number',
            //         },
			// 		{
			// 			type: 'Dropdown',
            //             options: [
            //                 ['시계방향', 'clockwise'],
            //                 ['반시계방향', 'counterclockwise'],
            //             ],
            //             value: 'clockwise',
            //             fontSize: 11,
            //             bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
            //             arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
			// 		},
			// 		{
			// 			type : 'Indicator',
			// 			img : 'block_icon/hardware_icon.svg',
			// 			size : 11,
			// 		},
			// 	],
			// 	events: {},
			// 	def: {
			// 		params : [
			// 			null,
			// 			{
			// 				type: 'number',
			// 				params: ['100'],
			// 			},
			// 			null,
			// 			null,
			// 		],
			// 		type: 'telliot_car_wheel_move',
			// 	},
			// 	paramsKeyMap: {
            //         MOTOR_PORT_ID: 0,
			// 		MOTOR_PORT_VALUE: 1,
			// 		MOTOR_DIRECTION: 2,
            //     },
			// 	class: 'telliot_car_flow',
			// 	//isNotFor : ['TelliotLite'],
			// 	func: (sprite, script) => this.req_motor_control(sprite, script)
			// },

			telliot_car_line_move : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['앞으로', 'forward'],
                           // ['뒤로', 'backward'],
                        ],
                        value: 'forward',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'telliot_car_line_move',
				},
				paramsKeyMap: {
                    LINE_TRACE_DIR: 0,
                },
				class: 'telliot_car_flow',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_line_trace(sprite, script)
			},

			// Telliot Car sensors
			telliot_car_sensor_is_detected : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_boolean_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['감지', 'detected'],
                            ['미감지', 'not detected'],
                        ],
                        value: 'detected',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'telliot_car_sensor_is_detected',
				},
				paramsKeyMap: {
                    OBJECT_DETECT: 0,
                },
				class: 'telliot_car_sensors',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_detect_object(sprite, script),
			},

			telliot_car_sensor_RFID_detect : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_boolean_field',
				statements: [],
				params: [
					{
						type: 'Dropdown',
                        options: [
                            ['동그라미', 'circle'],
                            ['네모', 'rectangle'],
							['세모', 'triangle'],
							['별', 'star'],
							['다이아몬드', 'diamond'],
							['하트', 'heart'],
                        ],
                        value: 'circle',
                        fontSize: 11,
                        bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
                        arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
					},
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [null, null],
					type: 'telliot_car_sensor_RFID_detect',
				},
				paramsKeyMap: {
                    TAG_DETECT: 0,
                },
				class: 'telliot_car_sensors',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_rfid_tag_detect(sprite, script),
			},

//			telliot_car_camera_detect : {
//				color: EntryStatic.colorSet.block.default.HARDWARE,
//				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//				skeleton: 'basic',
//				statements: [],
//				params: [
//					{
//						type : 'Indicator',
//						img : 'block_icon/hardware_icon.svg',
//						size : 12,
//					},
//				],
//				events: {},
//				def: {
//					params : [null],
//					type: 'telliot_lite_STT',
//				},
//				class: 'telliot_ai',
//				//isNotFor : ['TelliotLite'],
//				func(sprite, script) {
//					return script.callReturn();
//				},
//			},
//
			// AI
			telliot_car_chatbot : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_string_field',
				statements: [],
				params: [
					{
                      type: 'Block',
                      accept: 'string',
						defaultType: 'string',
                  },
					{
                      type: 'Block',
                      accept: 'string',
						defaultType: 'string',
                  },
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [
						{
							type: 'text',
							params: ['<질문>'],
						},
						{
							type: 'text',
							params: ['<답변>'],
						},
						null,
					],
					type: 'telliot_car_chatbot',
				},
				paramsKeyMap: {
					AI_CHATBOT_ASK: 0,
					AI_CHATBOT_RESP: 1,
              },
				class: 'telliot_ai',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_add_chatbot(sprite, script)
			},

			telliot_car_voice_command : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
                        type: 'Block',
                        accept: 'string',
						defaultType: 'string',
                    },
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [
						{
							type: 'text',
							params: ['<command>'],
						},
						null
					],
					type: 'telliot_car_voice_command',
				},
				paramsKeyMap: {
                    CAR_CHATBOT_CMD: 0,
                },
				class: 'telliot_ai',
				isNotFor : ['GoldenKidsAICar'],
				func(sprite, script) {
					return script.callReturn();
				},
			},

			// Voice Capture
			telliot_car_voice_trigger: {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params: [null],
					type: 'telliot_car_voice_trigger',
				},
				class: 'telliot_ai',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_voice_trigger(sprite, script)
			},

			// Speech to Text
			telliot_car_STT: {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [null],
					type: 'telliot_car_STT',
				},
				class: 'telliot_ai',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_speech_to_text(sprite, script)
			},

			// Text To Speech
			telliot_car_TTS: {
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
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params: [
						{
							type: 'text',
							params: ['<Text>'],
						},
						null
					],
					type: 'telliot_car_TTS',
				},
				paramsKeyMap: {
                    TEXT_TO_SPEECH: 0,
                },
				class: 'telliot_ai',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_text_to_speech(sprite, script)
			},

			// AI prompt
			telliot_car_add_prompt : {
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
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [
					   {
							type: 'text',
							params: ['<Prompt>'],
						},
						null
					],
					type: 'telliot_car_add_prompt',
				},
				paramsKeyMap: {
                    AI_PROMPT: 0,
                },
				class: 'telliot_ai',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_add_prompt(sprite, script)
			},
			telliot_car_set_led_color: {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
						options: [
							['왼쪽', 'left'],
							['오른쪽', 'right'],
							['양쪽', 'both'],
						],
						value: 'both',
						fontSize: 11,
						bgColor: EntryStatic.colorSet.block.darken.HARDWARE,  // 드롭다운 배경색
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
					params: [null, null, null],
					type: 'telliot_car_set_led_color',
				},
				pyHelpDef: {
					params: ['A&direction', 'B&color'],
					type: 'telliot_car_set_led_color',
				},
				paramsKeyMap: {
					DIRECTION: 0,
					COLOR: 1,
				},
				class: 'telliot_hardware',
				isNotFor: ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_change_led_color(sprite, script),
			},


			telliot_car_led_off: {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
						options: [
							['왼쪽', 'left'],
							['오른쪽', 'right'],
							['양쪽', 'both'],
						],
						value: 'both',
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
					params: [null, null],
					type: 'telliot_car_led_off',
				},
				pyHelpDef: {
					params: ['A&direction'],
					type: 'telliot_car_led_off',
				},
				paramsKeyMap: {
					DIRECTION: 0,
				},
				class: 'telliot_hardware',
				isNotFor: ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_turn_off_led(sprite, script),
				syntax: {
					js: [],
					py: [
						{
							syntax: 'Entry.turn_off_led(%1)',
							textParams: [
								{
									type: 'Dropdown',
									options: [
										['왼쪽', 'left'],
										['오른쪽', 'right'],
										['양쪽', 'both'],
									],
									value: 'both',
									fontSize: 11,
									bgColor: EntryStatic.colorSet.block.darken.HARDWARE,
									arrowColor: EntryStatic.colorSet.arrow.default.HARDWARE,
								},
							],
						},
					],
				},
			},
			telliot_car_led_rgb_setting: {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic',
				statements: [],
				params: [
					{
						type: 'Dropdown',
						options: [
							['왼쪽', 'left'],
							['오른쪽', 'right'],
							['양쪽', 'both'],
						],
						value: 'both',
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
						size: 12,
					},
				],
				events: {},
				def: {
					params: [
						'both',
						{
							type: 'text',
							params: ['255'],
						},
						{
							type: 'text',
							params: ['255'],
						},
						{
							type: 'text',
							params: ['255'],
						},
						null
					],
					type: 'telliot_car_led_rgb_setting',
				},
				paramsKeyMap: {
					DIRECTION: 0,
					RED: 1,
					GREEN: 2,
					BLUE: 3,
				},
				class: 'telliot_hardware',
				isNotFor: ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_change_led_rgb_color(sprite, script),
			},

			telliot_light_sensor_value : {
				color: EntryStatic.colorSet.block.default.HARDWARE,
				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
				skeleton: 'basic_string_field',
				statements: [],
				params: [
					{
						type : 'Indicator',
						img : 'block_icon/hardware_icon.svg',
						size : 11,
					},
				],
				events: {},
				def: {
					params : [null],
					type: 'telliot_cds_sensor_value',
				},
				class: 'telliot_cds_sensors',
				isNotFor : ['GoldenKidsAICar'],
				func: (sprite, script) => this.req_cds_value(sprite, script),
			},









//			telliot_car_set_prompt : {
//				color: EntryStatic.colorSet.block.default.HARDWARE,
//				outerLine: EntryStatic.colorSet.block.darken.HARDWARE,
//				skeleton: 'basic',
//				statements: [],
//				params: [
//					{
//						type : 'Indicator',
//						img : 'block_icon/hardware_icon.svg',
//						size : 12,
//					},
//				],
//				events: {},
//				def: {
//					params : [null],
//					type: 'telliot_lite_STT',
//				},
//				class: 'telliot_ai',
//				//isNotFor : ['TelliotLite'],
//				func: (sprite, script) => this.req_speech_to_text(sprite, script)
//			},
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

module.exports = new TelliotLite();
//module.exports = Entry.TelliotLite;
