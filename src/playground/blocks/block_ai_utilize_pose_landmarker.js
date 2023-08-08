import MediaPipeUtils from '../../util/mediaPipeUtils';

const mediaPipeUtils = MediaPipeUtils.getInstance();
Entry.AI_UTILIZE_BLOCK.poseLandmarker = {
    name: 'poseLandmarker',
    imageName: 'poseLandmarker.svg',
    title: {
        ko: '사람 인식',
        en: 'Pose Landmarker',
        jp: 'ビデオ検出',
    },
    titleKey: 'template.pose_landmarker_title_text',
    description: Lang.Msgs.ai_utilize_pose_landmarker_description,
    descriptionKey: 'Msgs.ai_utilize_pose_landmarker_description',
    isInitialized: false,
    async init() {
        await mediaPipeUtils.initialize();
        Entry.AI_UTILIZE_BLOCK.poseLandmarker.isInitialized = true;
    },
    destroy() {
        mediaPipeUtils.destroy();
        Entry.AI_UTILIZE_BLOCK.poseLandmarker.isInitialized = false;
    },
};

Entry.AI_UTILIZE_BLOCK.poseLandmarker.getBlocks = function() {
    const params = {
        getEventIndicator() {
            return {
                type: 'Indicator',
                img: 'block_icon/start_icon_play.svg',
                size: 14,
                position: {
                    x: 0,
                    y: -2,
                },
            };
        },
        getCommonIndicator() {
            return {
                type: 'Indicator',
                img: 'block_icon/ai_utilize_icon.svg',
                size: 11,
            };
        },
        getHandNumber() {
            return {
                type: 'Dropdown',
                options: [
                    ['1', 0],
                    ['2', 1],
                ],
                value: 0,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getHand() {
            return {
                type: 'Dropdown',
                options: [
                    ['오른손', 'Left'],
                    ['왼손', 'Right'],
                ],
                value: 'Left',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getGesture() {
            return {
                type: 'Dropdown',
                options: [
                    ['쥔 손', 'Closed_Fist'],
                    ['편 손', 'Open_Palm'],
                    ['가리킨 손', 'Pointing_Up'],
                    ['엄지 아래로', 'Thumb_Down'],
                    ['엄지 위로', 'Thumb_Up'],
                    ['브이 사인', 'Victory'],
                    ['사랑해', 'ILoveYou'],
                ],
                value: 'Left',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getHandPoint() {
            return {
                type: 'Dropdown',
                options: [
                    ['엄지', 1],
                    ['검지', 5],
                    ['중지', 9],
                    ['약지', 13],
                    ['소지', 17],
                    ['손목', 0],
                ],
                value: 1,
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
                dropdownSync: 'handPoint',
            };
        },
        getHandDetailPoint() {
            return {
                type: 'DropdownDynamic',
                menuName() {
                    const handPoint = this.getTargetValue('handPoint');
                    if (handPoint === 1) {
                        this.setValue(3);
                        return [
                            ['끝', 3],
                            ['첫째 마디', 2],
                        ];
                    } else if (handPoint !== 0) {
                        this.setValue(3);
                        return [
                            ['끝', 3],
                            ['첫째 마디', 2],
                            ['둘째 마디', 1],
                        ];
                    } else {
                        this.setValue(0);
                        return [['없음', 0]];
                    }
                },
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getAxis() {
            return {
                type: 'Dropdown',
                options: [
                    ['x', 'x'],
                    ['y', 'y'],
                ],
                value: 'x',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getStartStop() {
            return {
                type: 'Dropdown',
                options: [
                    ['시작하기', 'start'],
                    ['중지하기', 'stop'],
                ],
                value: 'start',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
        getShowHide() {
            return {
                type: 'Dropdown',
                options: [
                    ['보이기', 'show'],
                    ['숨기기', 'hide'],
                ],
                value: 'show',
                fontSize: 11,
                bgColor: EntryStatic.colorSet.block.darken.AI_UTILIZE,
                arrowColor: EntryStatic.colorSet.common.WHITE,
            };
        },
    };
    return {
        when_pose_landmarker: {
            template: '%1 사람을 인식했을 때',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_event',
            statements: [],
            params: [params.getEventIndicator()],
            events: {},
            def: {
                params: [null],
                type: 'when_pose_landmarker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            event: 'when_pose_landmarker',
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                return script.callReturn();
            },
        },
        pose_landmarker: {
            template: '사람 인식 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getStartStop(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'pose_landmarker',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'start') {
                    await mediaPipeUtils.startPoseLandmarker(value);
                } else {
                    await mediaPipeUtils.stopPoseLandmarker(value);
                }
                return script.callReturn();
            },
        },
        draw_detected_pose: {
            template: '인식한 사람 %1 %2',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic',
            statements: [],
            params: [params.getShowHide(), params.getCommonIndicator()],
            events: {},
            def: {
                type: 'draw_detected_pose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            async func(sprite, script) {
                const value = script.getField('VALUE');
                if (!mediaPipeUtils.isInitialized) {
                    await mediaPipeUtils.initialize();
                }
                if (value === 'show') {
                    mediaPipeUtils.changeDrawDetectedPoseLandmarker(true);
                } else {
                    mediaPipeUtils.changeDrawDetectedPoseLandmarker(false);
                }
                return script.callReturn();
            },
        },
        check_detected_pose: {
            template: '사람을 인식했는가?',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_boolean_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'check_detected_pose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                return mediaPipeUtils.isPrevPoseLandmarker;
            },
        },
        count_detected_pose: {
            template: '인식한 사람의 수',
            color: EntryStatic.colorSet.block.default.AI_UTILIZE,
            outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
            skeleton: 'basic_string_field',
            statements: [],
            params: [],
            events: {},
            def: {
                type: 'count_detected_pose',
            },
            paramsKeyMap: {
                VALUE: 0,
            },
            class: 'pose',
            isNotFor: ['poseLandmarker'],
            func(sprite, script) {
                return mediaPipeUtils.countDetectedPose;
            },
        },
        // locate_to_hand: {
        //     template: '%1 번째의 손의 %2 %3 (으)로 이동하기 %4',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         params.getHandNumber(),
        //         params.getHandPoint(),
        //         params.getHandDetailPoint(),
        //         params.getCommonIndicator(),
        //     ],
        //     events: {},
        //     def: {
        //         type: 'locate_to_hand',
        //     },
        //     paramsKeyMap: {
        //         HAND: 0,
        //         HAND_POINT: 1,
        //         HAND_DETAIL_POINT: 2,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         const hand = script.getField('HAND');
        //         const point = script.getField('HAND_POINT');
        //         const detail = script.getField('HAND_DETAIL_POINT');
        //         const handPoint = point + detail;
        //         const axis = mediaPipeUtils.getHandPointAxis(hand, handPoint);
        //         if (axis) {
        //             sprite.setX(axis.x);
        //             sprite.setY(axis.y);
        //             if (sprite.brush && !sprite.brush.stop) {
        //                 sprite.brush.lineTo(axis.x, axis.y * -1);
        //             }
        //         }
        //         return script.callReturn();
        //     },
        // },
        // locate_time_to_hand: {
        //     template: '%1 초 동안 %2 번째의 손의 %3 %4 (으)로 이동하기 %5',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic',
        //     statements: [],
        //     params: [
        //         {
        //             type: 'Block',
        //             accept: 'string',
        //             defaultType: 'number',
        //         },
        //         params.getHandNumber(),
        //         params.getHandPoint(),
        //         params.getHandDetailPoint(),
        //         params.getCommonIndicator(),
        //     ],
        //     events: {},
        //     def: {
        //         params: [
        //             {
        //                 type: 'number',
        //                 params: ['2'],
        //             },
        //             null,
        //             null,
        //             null,
        //         ],
        //         type: 'locate_time_to_hand',
        //     },
        //     paramsKeyMap: {
        //         TIME: 0,
        //         HAND: 1,
        //         HAND_POINT: 2,
        //         HAND_DETAIL_POINT: 3,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         if (!script.isStart) {
        //             const time = script.getNumberValue('TIME', script);
        //             const frameCount = Math.floor(time * Entry.FPS);
        //             const hand = script.getField('HAND', script);
        //             const point = script.getField('HAND_POINT', script);
        //             const detail = script.getField('HAND_DETAIL_POINT', script);
        //             const handPoint = point + detail;

        //             if (frameCount != 0) {
        //                 const axis = mediaPipeUtils.getHandPointAxis(hand, handPoint);
        //                 if (axis) {
        //                     script.isStart = true;
        //                     script.frameCount = frameCount;
        //                     script.dX = (axis.x - sprite.getX()) / script.frameCount;
        //                     script.dY = (axis.y - sprite.getY()) / script.frameCount;
        //                 }
        //             } else {
        //                 const axis = mediaPipeUtils.getHandPointAxis(hand, handPoint);
        //                 if (axis) {
        //                     sprite.setX(axis.x);
        //                     sprite.setY(axis.y);
        //                     if (sprite.brush && !sprite.brush.stop) {
        //                         sprite.brush.lineTo(axis.x, axis.y * -1);
        //                     }
        //                 }
        //                 return script.callReturn();
        //             }
        //         }
        //         if (script.frameCount != 0) {
        //             sprite.setX(sprite.getX() + script.dX);
        //             sprite.setY(sprite.getY() + script.dY);
        //             script.frameCount--;
        //             if (sprite.brush && !sprite.brush.stop) {
        //                 sprite.brush.lineTo(sprite.getX(), sprite.getY() * -1);
        //             }
        //             return script;
        //         } else {
        //             delete script.isStart;
        //             delete script.frameCount;
        //             return script.callReturn();
        //         }
        //     },
        // },
        // axis_detected_hand: {
        //     template: '%1 번째 손의 %2 %3 의 %4 좌표',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_string_field',
        //     statements: [],
        //     params: [
        //         params.getHandNumber(),
        //         params.getHandPoint(),
        //         params.getHandDetailPoint(),
        //         params.getAxis(),
        //     ],
        //     events: {},
        //     def: {
        //         params: [null, null, null, null],
        //         type: 'axis_detected_hand',
        //     },
        //     paramsKeyMap: {
        //         HAND: 0,
        //         HAND_POINT: 1,
        //         HAND_DETAIL_POINT: 2,
        //         AXIS: 3,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         const hand = script.getField('HAND', script);
        //         const point = script.getField('HAND_POINT', script);
        //         const detail = script.getField('HAND_DETAIL_POINT', script);
        //         const axisName = script.getField('AXIS', script);
        //         const handPoint = point + detail;
        //         const axis = mediaPipeUtils.getHandPointAxis(hand, handPoint);
        //         if (axis) {
        //             return axis[axisName];
        //         }
        //         return 0;
        //     },
        // },
        // is_which_hand: {
        //     template: '%1 번째 손이 %2 인가?',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_boolean_field',
        //     statements: [],
        //     params: [params.getHandNumber(), params.getHand()],
        //     events: {},
        //     def: { params: [null, null], type: 'is_which_hand' },
        //     paramsKeyMap: {
        //         HAND_NUM: 0,
        //         HAND: 1,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         const handNum = script.getField('HAND_NUM', script);
        //         const hand = script.getField('HAND', script);
        //         const handedness = mediaPipeUtils.getHandedness(handNum);
        //         if (!handedness) {
        //             return false;
        //         }
        //         return handedness.categoryName === hand;
        //     },
        // },
        // get_which_hand: {
        //     template: '%1 번째 손',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_string_field',
        //     statements: [],
        //     params: [params.getHandNumber()],
        //     events: {},
        //     def: { params: [null, null], type: 'get_which_hand' },
        //     paramsKeyMap: {
        //         HAND_NUM: 0,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         const handNum = script.getField('HAND_NUM', script);
        //         const handedness = mediaPipeUtils.getHandedness(handNum);
        //         if (!handedness) {
        //             return '';
        //         } else if (handedness.categoryName === 'Left') {
        //             return '오른손';
        //         } else {
        //             return '왼손';
        //         }
        //     },
        // },
        // is_which_gesture: {
        //     template: '%1 번째 손의 모양이 %2 인가?',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_boolean_field',
        //     statements: [],
        //     params: [params.getHandNumber(), params.getGesture()],
        //     events: {},
        //     def: { params: [null, null], type: 'is_which_gesture' },
        //     paramsKeyMap: {
        //         HAND_NUM: 0,
        //         GESTURE: 1,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         const handNum = script.getField('HAND_NUM', script);
        //         const gestureName = script.getField('GESTURE', script);
        //         const gesture = mediaPipeUtils.getGesture(handNum);
        //         if (!gesture) {
        //             return false;
        //         }
        //         return gesture.categoryName === gestureName;
        //     },
        // },
        // get_which_gesture: {
        //     template: '%1 번째 손의 모양',
        //     color: EntryStatic.colorSet.block.default.AI_UTILIZE,
        //     outerLine: EntryStatic.colorSet.block.darken.AI_UTILIZE,
        //     skeleton: 'basic_string_field',
        //     statements: [],
        //     params: [params.getHandNumber()],
        //     events: {},
        //     def: { params: [null, null], type: 'get_which_gesture' },
        //     paramsKeyMap: {
        //         HAND_NUM: 0,
        //     },
        //     class: 'pose',
        //     isNotFor: ['poseLandmarker'],
        //     func(sprite, script) {
        //         const handNum = script.getField('HAND_NUM', script);
        //         const gesture = mediaPipeUtils.getGesture(handNum);
        //         if (!gesture) {
        //             return '';
        //         }
        //         return gestureMap[gesture.categoryName] || '';
        //     },
        // },
    };
};
