import singleInstance from '../core/singleInstance';
import { GEHelper } from '../graphicEngine/GEHelper';
import {
    FilesetResolver,
    DrawingUtils,
    GestureRecognizer,
    GestureRecognizerResult,
    PoseLandmarker,
    PoseLandmarkerResult,
    FaceLandmarkerResult,
    FaceLandmarker,
    ObjectDetector,
    ObjectDetectorResult,
} from '@mediapipe/tasks-vision';
import { UAParser } from 'ua-parser-js';
import _clamp from 'lodash/clamp';
import VideoMotionWorker from './workers/newmotion.worker.ts';

export const getInputList = async () => {
    if (navigator.mediaDevices) {
        return (await navigator.mediaDevices.enumerateDevices()) || [];
    }
    return [];
};

const parser = new UAParser();

export const flipState = {
    NORMAL: 0,
    HORIZONTAL: 1,
    VERTICAL: 2,
    BOTH: 3,
};
type FLIP_NORMAL = 0;
type FLIP_HORIZONTAL = 1;
type FLIP_VERTICAL = 2;
type FLIP_BOTH = 3;
type TFlipState = FLIP_NORMAL | FLIP_HORIZONTAL | FLIP_VERTICAL | FLIP_BOTH;

type TGestureRecognitionOption = {
    isDrawDetectedHand?: boolean;
};

type MotionElement = {
    total: number;
    direction: {
        x: number;
        y: number;
    };
};

type Pixel = {
    r: number;
    g: number;
    b: number;
    rDiff: number;
    gDiff: number;
    bDiff: number;
};

const flipActions = {
    [flipState.NORMAL]: {
        [flipState.HORIZONTAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
        [flipState.VERTICAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.BOTH]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
    },
    [flipState.HORIZONTAL]: {
        [flipState.NORMAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
        [flipState.VERTICAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.BOTH]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
    },
    [flipState.VERTICAL]: {
        [flipState.NORMAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.HORIZONTAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.BOTH]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
    },
    [flipState.BOTH]: {
        [flipState.NORMAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.HORIZONTAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.vFlipVideoElement(videos);
        },
        [flipState.VERTICAL]: (videos: PIXI.Sprite[] | createjs.Bitmap[]) => {
            GEHelper.hFlipVideoElement(videos);
        },
    },
};

class MediaPipeUtils {
    public isInitialized: boolean = false;
    public videoInputList: string[][] = [];
    public canvasVideo: PIXI.Sprite | createjs.Bitmap;
    public canvasOverlay: PIXI.Sprite | createjs.Bitmap;
    public video: HTMLVideoElement;
    public videoCanvas: HTMLCanvasElement;
    public videoCanvasCtx: CanvasRenderingContext2D;
    public motionCanvas: HTMLCanvasElement;
    public motionOffscreenCanvas: HTMLCanvasElement;
    public canWorker: boolean = true;
    public flipState: TFlipState = 0;
    private VIDEO_WIDTH: number = 640;
    private VIDEO_HEIGHT: number = 360;
    private STAGE_WIDTH: number = 480;
    private STAGE_HEIGHT: number = 260;
    private SAMPLE_SIZE: number = 15;
    private stream: MediaStream;
    private lastVideoTime: number = -1;
    private sourceTarget: number;

    public countDetectedHand: number;
    public isPrevHandDetected: boolean = false;
    public isRunningHandGesture: boolean = false;
    public isDrawDetectedHand: boolean = false;
    private isInitGestureRecognition: boolean = false;
    private gestureRecognizerVideoCanvas: HTMLCanvasElement;
    private gestureRecognizerVideoCanvasCtx: CanvasRenderingContext2D;
    private gestureRecognizerCanvasOverlay: PIXI.Sprite | createjs.Bitmap;
    private gestureRecognizerOffscreenCanvas: OffscreenCanvas;
    private gestureRecognizerWorker: Worker;
    private alreadyInitGestureRecognizerOffscreenCanvas: boolean = false;
    private gestureRecognizerDrawingUtils: DrawingUtils;
    private prevGestureRecognizerResult: GestureRecognizerResult;
    private gestureRecognizer: GestureRecognizer;

    public countDetectedPose: number;
    public isPrevPoseLandmarker: boolean = false;
    public isRunningPoseLandmarker: boolean = false;
    public isDrawDetectedPoseLandmarker: boolean = false;
    private isInitPoseLandmarker: boolean = false;
    private poseLandmarkerVideoCanvas: HTMLCanvasElement;
    private poseLandmarkerVideoCanvasCtx: CanvasRenderingContext2D;
    private poseLandmarkerCanvasOverlay: PIXI.Sprite | createjs.Bitmap;
    private poseLandmarkerOffscreenCanvas: OffscreenCanvas;
    private poseLandmarkerWorker: Worker;
    private alreadyInitPoseLandmarkerOffscreenCanvas: boolean = false;
    private poseLandmarkerDrawingUtils: DrawingUtils;
    private prevPoseLandmarkerResult: PoseLandmarkerResult;
    private poseLandmarker: PoseLandmarker;

    public countDetectedFace: number;
    public isPrevFaceLandmarker: boolean = false;
    public isRunningFaceLandmarker: boolean = false;
    public isDrawDetectedFaceLandmarker: boolean = false;
    private isInitFaceLandmarker: boolean = false;
    private faceLandmarkerVideoCanvas: HTMLCanvasElement;
    private faceLandmarkerVideoCanvasCtx: CanvasRenderingContext2D;
    private faceLandmarkerCanvasOverlay: PIXI.Sprite | createjs.Bitmap;
    private faceLandmarkerOffscreenCanvas: OffscreenCanvas;
    private faceLandmarkerWorker: Worker;
    private alreadyInitFaceLandmarkerOffscreenCanvas: boolean = false;
    private faceLandmarkerDrawingUtils: DrawingUtils;
    private prevFaceLandmarkerResult: FaceLandmarkerResult;
    private faceLandmarker: FaceLandmarker;

    public countDetectedObject: number;
    public isPrevObjectDetector: boolean = false;
    public isRunningObjectDetector: boolean = false;
    public isDrawDetectedObjectDetector: boolean = false;
    private isInitObjectDetector: boolean = false;
    private objectDetectorVideoCanvas: HTMLCanvasElement;
    private objectDetectorVideoCanvasCtx: CanvasRenderingContext2D;
    private objectDetectorCanvasOverlay: PIXI.Sprite | createjs.Bitmap;
    private objectDetectorOffscreenCanvas: OffscreenCanvas;
    private objectDetectorWorker: Worker;
    private alreadyInitObjectDetectorOffscreenCanvas: boolean = false;
    private objectDetectorDrawingUtils: DrawingUtils;
    private prevObjectDetectorResult: ObjectDetectorResult;
    private objectDetector: ObjectDetector;

    public totalMotions: MotionElement = { total: 0, direction: { x: 0, y: 0 } };
    public motions: Pixel[][] = [
        ...Array(Math.ceil(this.STAGE_HEIGHT / this.SAMPLE_SIZE)),
    ].map((e) => Array(this.STAGE_WIDTH / this.SAMPLE_SIZE));
    public motionWorker: Worker = new VideoMotionWorker();

    constructor() {
        const uaResult = parser.getResult();
        if (uaResult.browser.name === 'Safari' || uaResult.os.name === 'iOS') {
            this.canWorker = false;
        }
    }

    get isRunning() {
        return Boolean(this.video.srcObject);
    }

    get allCanvases(): PIXI.Sprite[] | createjs.Bitmap[] {
        return [
            this.canvasVideo,
            this.canvasOverlay,
            this.gestureRecognizerCanvasOverlay,
            this.poseLandmarkerCanvasOverlay,
            this.faceLandmarkerCanvasOverlay,
            this.objectDetectorCanvasOverlay,
        ] as PIXI.Sprite[] | createjs.Bitmap[];
    }

    get overlayCanvases(): PIXI.Sprite[] | createjs.Bitmap[] {
        return [
            this.canvasOverlay,
            this.gestureRecognizerCanvasOverlay,
            this.poseLandmarkerCanvasOverlay,
            this.faceLandmarkerCanvasOverlay,
            this.objectDetectorCanvasOverlay,
        ] as PIXI.Sprite[] | createjs.Bitmap[];
    }

    changeCanWorker(canWorker: boolean) {
        this.canWorker = canWorker;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        await this.checkPermission();
        const inputList = await getInputList();
        this.videoInputList = inputList
            .filter((input) => input.kind === 'videoinput' && input.deviceId)
            .map((item) => [item.label, item.deviceId]);

        await this.compatabilityChecker();
        this.motionCanvas = document.createElement('canvas');
        this.motionCanvas.width = this.VIDEO_WIDTH;
        this.motionCanvas.height = this.VIDEO_HEIGHT;
        const video = document.createElement('video');
        video.id = 'webCamElement';
        video.autoplay = true;
        video.width = this.VIDEO_WIDTH;
        video.height = this.VIDEO_HEIGHT;
        this.canvasVideo = GEHelper.getVideoElement(video);
        GEHelper.hFlipVideoElement(this.allCanvases as PIXI.Sprite[] | createjs.Bitmap[]);
        this.video = video;
        Entry.addEventListener('beforeStop', this.reset.bind(this));
        this.isInitialized = true;
        this.initMotionWorkerEvent();
    }

    sleep(ms?: number) {
        return new Promise((resolve) => {
            if (ms) {
                setTimeout(resolve, ms);
            } else {
                requestAnimationFrame(resolve);
            }
        });
    }

    initMotionWorkerEvent() {
        this.motionWorker.onmessage = ({ data }) => {
            if (data.action === 'init_complete') {
                this.motionDetect();
            } else if (data.action === 'next_detect_motion') {
                this.totalMotions = data.result;
                setTimeout(this.motionDetect.bind(this), 100);
            }
        };
    }

    cameraOnOff(mode: String) {
        if (mode === 'on') {
            this.turnOnWebcam();
        } else {
            this.turnOffWebcam();
        }
    }

    async changeSource(target: number) {
        const inputSource = this.videoInputList[target];
        if (!inputSource) {
            return;
        }
        this.sourceTarget = target;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: {
                        exact: inputSource[1],
                    },
                    width: this.VIDEO_WIDTH,
                    height: this.VIDEO_HEIGHT,
                },
            });
            this.stream = stream;
            this.video.srcObject = this.stream;
            this.video.width = this.VIDEO_WIDTH;
            this.video.height = this.VIDEO_HEIGHT;
            this.video.style.transform = 'scaleX(-1)';
        } catch (err) {
            console.log(err);
        }
    }

    setFlipState(state: TFlipState) {
        if (!this.canvasVideo) {
            return;
        }
        this.setForceFlipState(this.flipState, state);
    }

    setForceFlipState(prevState: TFlipState, nextState: TFlipState) {
        const action = flipActions[prevState][nextState];
        if (action) {
            action(this.allCanvases);
        }
        this.flipState = nextState;
    }

    setOpacityCamera(opacity: number) {
        GEHelper.setVideoAlpha(this.canvasVideo, opacity);
    }

    turnOffWebcam() {
        if (this.video.srcObject) {
            const stream: MediaStream = this.video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            window.requestAnimationFrame(() => {
                this.video.srcObject = null;
                this.stream = undefined;
            });
        }

        GEHelper.turnOffWebcam(this.canvasVideo);
        this.overlayCanvases.forEach((canvas: PIXI.Sprite | createjs.Bitmap) => {
            GEHelper.turnOffOverlay(canvas);
        });
        this.setForceFlipState(this.flipState, 0);
    }

    async turnOnWebcam() {
        let stream;
        try {
            const target = this.sourceTarget || 0;
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: this.videoInputList[target][1] },
                    width: this.VIDEO_WIDTH,
                    height: this.VIDEO_HEIGHT,
                },
            });
        } catch (err) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_webcam_error,
            ]);
        }
        this.video.srcObject = stream;
        this.stream = stream;
        try {
            await this.video.play();
        } catch {}
        GEHelper.drawVideoElement(this.canvasVideo);
        this.overlayCanvases.forEach((canvas: PIXI.Sprite | createjs.Bitmap) => {
            GEHelper.drawOverlayElement(canvas);
        });
        this.motionWorker.postMessage({
            action: 'init',
            width: this.VIDEO_WIDTH,
            height: this.VIDEO_HEIGHT,
        });
    }

    async checkPermission() {
        if (navigator.permissions) {
            const permission = await navigator.permissions.query({ name: 'camera' });
            if (permission.state !== 'granted') {
                await navigator.mediaDevices.getUserMedia({ video: true });
            }
        } else {
            await navigator.mediaDevices.getUserMedia({ video: true });
        }
    }

    async compatabilityChecker() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_browser_error_video,
            ]);
        }
        if (!this.stream && this.videoInputList.length == 0) {
            throw new Entry.Utils.IncompatibleError('IncompatibleError', [
                Lang.Workspace.check_webcam_error,
            ]);
        }
    }

    isFlipState(type: string) {
        if (type === 'horizontal') {
            return this.flipState === flipState.BOTH || this.flipState === flipState.HORIZONTAL;
        } else if (type === 'vertical') {
            return this.flipState === flipState.BOTH || this.flipState === flipState.VERTICAL;
        }
    }

    motionDetect(sprite?: any): Promise<MotionElement> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.motionCanvas || !this.isRunning) {
                    resolve(undefined);
                    return;
                }
                if (this.video.readyState < 2) {
                    await this.sleep();
                    resolve(this.motionDetect(sprite));
                    return;
                }

                if (sprite) {
                    const returnMessage = ({ data }: MessageEvent) => {
                        if (data.action === 'sprite_return') {
                            this.motionWorker.removeEventListener('message', returnMessage);
                            resolve(data.result);
                        }
                    };
                    this.motionWorker.addEventListener('message', returnMessage);
                }
                const { STAGE_WIDTH: width, STAGE_HEIGHT: height, SAMPLE_SIZE: sampleSize } = this;
                const [minX, maxX] = [0, width];
                const [minY, maxY] = [0, height];
                const imageBitmap = await createImageBitmap(this.video);
                this.motionWorker.postMessage({
                    sprite: sprite && {
                        x: sprite.x,
                        y: sprite.y,
                        width: sprite.width,
                        height: sprite.height,
                        scaleX: sprite.scaleX,
                        scaleY: sprite.scaleY,
                    },
                    action: 'motion',
                    range: {
                        minX,
                        maxX,
                        minY,
                        maxY,
                    },
                    imageBitmap,
                });

                if (!sprite) {
                    resolve(undefined);
                }
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    getYX(a: number) {
        return Math.max(1, Math.min(10, 10 * (1 - (a - -0.15) / 0.25) + (1 - (0.1 - a) / 0.25)));
    }

    async sendImageBitmapForGesture() {
        if (!this.isRunningHandGesture) {
            return;
        }
        if (this.video.readyState < 2) {
            await this.sleep();
            this.sendImageBitmapForGesture();
            return;
        }
        this.gestureRecognizerWorker.postMessage({
            action: 'gesture_recognizer',
            imageBitmap: await createImageBitmap(this.video),
        });
    }

    async sendImageBitmapForPoseLandmarker() {
        if (!this.isRunningPoseLandmarker) {
            return;
        }
        if (this.video.readyState < 2) {
            await this.sleep();
            this.sendImageBitmapForPoseLandmarker();
            return;
        }
        this.poseLandmarkerWorker.postMessage({
            action: 'pose_landmarker',
            imageBitmap: await createImageBitmap(this.video),
        });
    }

    async sendImageBitmapForFaceLandmarker() {
        if (!this.isRunningFaceLandmarker) {
            return;
        }
        if (this.video.readyState < 2) {
            await this.sleep();
            this.sendImageBitmapForFaceLandmarker();
            return;
        }
        this.faceLandmarkerWorker.postMessage({
            action: 'face_landmarker',
            imageBitmap: await createImageBitmap(this.video),
        });
    }

    async sendImageBitmapForObjectDetector() {
        if (!this.isRunningObjectDetector) {
            return;
        }
        if (this.video.readyState < 2) {
            await this.sleep();
            this.sendImageBitmapForObjectDetector();
            return;
        }
        this.objectDetectorWorker.postMessage({
            action: 'object_detector',
            imageBitmap: await createImageBitmap(this.video),
        });
    }

    initGestureRecognitionWorkerEvent() {
        this.gestureRecognizerWorker.addEventListener('message', ({ data }) => {
            if (['next_gesture_recognizer'].includes(data.action)) {
                this.sendImageBitmapForGesture();
            } else if (data.action === 'start_gesture_recognizer') {
                this.isPrevHandDetected = true;
                Entry.engine.fireEvent('when_hand_detection');
            } else if (data.action === 'stop_gesture_recognizer') {
                this.isPrevHandDetected = false;
            } else if (data.action === 'count_detected_hand_gesture_recognizer') {
                this.countDetectedHand = data.count;
            } else if (data.action === 'gesture_recognizer_data') {
                this.prevGestureRecognizerResult = data.gestureRecognizerResult;
            }
        });
    }

    initPoseLandmarkerWorkerEvent() {
        this.poseLandmarkerWorker.addEventListener('message', ({ data }) => {
            if (['next_pose_landmarker'].includes(data.action)) {
                this.sendImageBitmapForPoseLandmarker();
            } else if (data.action === 'start_pose_landmarker') {
                this.isPrevPoseLandmarker = true;
                Entry.engine.fireEvent('when_pose_landmarker');
            } else if (data.action === 'stop_pose_landmarker') {
                this.isPrevPoseLandmarker = false;
            } else if (data.action === 'count_detected_pose_landmarker') {
                this.countDetectedPose = data.count;
            } else if (data.action === 'pose_landmarker_data') {
                this.prevPoseLandmarkerResult = data.poseLandmarkerResult;
            }
        });
    }

    initFaceLandmarkerWorkerEvent() {
        this.faceLandmarkerWorker.addEventListener('message', ({ data }) => {
            if (['next_face_landmarker'].includes(data.action)) {
                this.sendImageBitmapForFaceLandmarker();
            } else if (data.action === 'start_face_landmarker') {
                this.isPrevFaceLandmarker = true;
                Entry.engine.fireEvent('when_face_landmarker');
            } else if (data.action === 'stop_face_landmarker') {
                this.isPrevFaceLandmarker = false;
            } else if (data.action === 'count_detected_face_landmarker') {
                this.countDetectedFace = data.count;
            } else if (data.action === 'face_landmarker_data') {
                this.prevFaceLandmarkerResult = data.faceLandmarkerResult;
            }
        });
    }

    initObjectDetectorWorkerEvent() {
        this.objectDetectorWorker.addEventListener('message', ({ data }) => {
            if (['next_object_detector'].includes(data.action)) {
                this.sendImageBitmapForObjectDetector();
            } else if (data.action === 'start_object_detector') {
                this.isPrevObjectDetector = true;
                Entry.engine.fireEvent('when_object_detector');
            } else if (data.action === 'stop_object_detector') {
                this.isPrevObjectDetector = false;
            } else if (data.action === 'count_detected_object_detector') {
                this.countDetectedObject = data.count;
            } else if (data.action === 'object_detector_data') {
                this.prevObjectDetectorResult = data.objectDetectorResult;
            }
        });
    }

    initHandGestureRecognition() {
        this.isInitGestureRecognition = true;
        this.gestureRecognizerVideoCanvas = document.createElement('canvas');
        this.gestureRecognizerVideoCanvas.width = this.VIDEO_WIDTH;
        this.gestureRecognizerVideoCanvas.height = this.VIDEO_HEIGHT;
        this.gestureRecognizerCanvasOverlay = GEHelper.getOverlayElement(
            this.gestureRecognizerVideoCanvas
        );
        GEHelper.drawOverlayElement(this.gestureRecognizerCanvasOverlay);
        GEHelper.hFlipVideoElement(this.gestureRecognizerCanvasOverlay);
        if (this.canWorker) {
            // eslint-disable-next-line max-len
            this.gestureRecognizerOffscreenCanvas = this.gestureRecognizerVideoCanvas.transferControlToOffscreen();
            this.gestureRecognizerWorker = new Worker(
                '/lib/entry-js/extern/gesture-recognition.worker.js'
            );
            this.initGestureRecognitionWorkerEvent();
        } else {
            this.gestureRecognizerVideoCanvasCtx = this.gestureRecognizerVideoCanvas.getContext(
                '2d'
            );
            this.gestureRecognizerVideoCanvasCtx.font = '20px Arial';
            this.gestureRecognizerDrawingUtils = new DrawingUtils(
                this.gestureRecognizerVideoCanvasCtx
            );
        }
    }

    initPoseLandmarker() {
        this.isInitPoseLandmarker = true;
        this.poseLandmarkerVideoCanvas = document.createElement('canvas');
        this.poseLandmarkerVideoCanvas.width = this.VIDEO_WIDTH;
        this.poseLandmarkerVideoCanvas.height = this.VIDEO_HEIGHT;
        this.poseLandmarkerCanvasOverlay = GEHelper.getOverlayElement(
            this.poseLandmarkerVideoCanvas
        );
        GEHelper.drawOverlayElement(this.poseLandmarkerCanvasOverlay);
        GEHelper.hFlipVideoElement(this.poseLandmarkerCanvasOverlay);
        if (this.canWorker) {
            // eslint-disable-next-line max-len
            this.poseLandmarkerOffscreenCanvas = this.poseLandmarkerVideoCanvas.transferControlToOffscreen();
            this.poseLandmarkerWorker = new Worker(
                '/lib/entry-js/extern/pose-landmarker.worker.js'
            );
            this.initPoseLandmarkerWorkerEvent();
        } else {
            this.poseLandmarkerVideoCanvasCtx = this.poseLandmarkerVideoCanvas.getContext('2d');
            this.poseLandmarkerVideoCanvasCtx.font = '20px Arial';
            this.poseLandmarkerDrawingUtils = new DrawingUtils(this.poseLandmarkerVideoCanvasCtx);
        }
    }

    initFaceLandmarker() {
        this.isInitFaceLandmarker = true;
        this.faceLandmarkerVideoCanvas = document.createElement('canvas');
        this.faceLandmarkerVideoCanvas.width = this.VIDEO_WIDTH;
        this.faceLandmarkerVideoCanvas.height = this.VIDEO_HEIGHT;
        this.faceLandmarkerCanvasOverlay = GEHelper.getOverlayElement(
            this.faceLandmarkerVideoCanvas
        );
        GEHelper.drawOverlayElement(this.faceLandmarkerCanvasOverlay);
        GEHelper.hFlipVideoElement(this.faceLandmarkerCanvasOverlay);
        if (this.canWorker) {
            // eslint-disable-next-line max-len
            this.faceLandmarkerOffscreenCanvas = this.faceLandmarkerVideoCanvas.transferControlToOffscreen();
            this.faceLandmarkerWorker = new Worker(
                '/lib/entry-js/extern/face-landmarker.worker.js'
            );
            this.initFaceLandmarkerWorkerEvent();
        } else {
            this.faceLandmarkerVideoCanvasCtx = this.faceLandmarkerVideoCanvas.getContext('2d');
            this.faceLandmarkerVideoCanvasCtx.font = '20px Arial';
            this.faceLandmarkerDrawingUtils = new DrawingUtils(this.faceLandmarkerVideoCanvasCtx);
        }
    }

    initObjectDetector() {
        this.isInitObjectDetector = true;
        this.objectDetectorVideoCanvas = document.createElement('canvas');
        this.objectDetectorVideoCanvas.width = this.VIDEO_WIDTH;
        this.objectDetectorVideoCanvas.height = this.VIDEO_HEIGHT;
        this.objectDetectorCanvasOverlay = GEHelper.getOverlayElement(
            this.objectDetectorVideoCanvas
        );
        GEHelper.drawOverlayElement(this.objectDetectorCanvasOverlay);
        GEHelper.hFlipVideoElement(this.objectDetectorCanvasOverlay);
        if (this.canWorker) {
            // eslint-disable-next-line max-len
            this.objectDetectorOffscreenCanvas = this.objectDetectorVideoCanvas.transferControlToOffscreen();
            this.objectDetectorWorker = new Worker(
                '/lib/entry-js/extern/object-detector.worker.js'
            );
            this.initObjectDetectorWorkerEvent();
        } else {
            this.objectDetectorVideoCanvasCtx = this.objectDetectorVideoCanvas.getContext('2d');
            this.objectDetectorVideoCanvasCtx.font = '20px Arial';
            this.objectDetectorDrawingUtils = new DrawingUtils(this.objectDetectorVideoCanvasCtx);
        }
    }

    async startHandGestureRecognition() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            if (!this.isInitGestureRecognition) {
                this.initHandGestureRecognition();
            }
            this.isRunningHandGesture = true;

            if (this.canWorker) {
                if (!this.alreadyInitGestureRecognizerOffscreenCanvas) {
                    this.gestureRecognizerWorker.postMessage(
                        {
                            action: 'gesture_recognizer_init',
                            canvas: this.gestureRecognizerOffscreenCanvas,
                            option: {
                                isDrawDetectedHand: this.isDrawDetectedHand,
                            },
                        },
                        [this.gestureRecognizerOffscreenCanvas]
                    );
                    this.alreadyInitGestureRecognizerOffscreenCanvas = true;
                } else {
                    this.sendImageBitmapForGesture();
                }
            } else {
                await this.initPredictHandGesture();
                this.predictHandGesture();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async startPoseLandmarker() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            if (!this.isInitPoseLandmarker) {
                this.initPoseLandmarker();
            }
            this.isRunningPoseLandmarker = true;

            if (this.canWorker) {
                if (!this.alreadyInitPoseLandmarkerOffscreenCanvas) {
                    this.poseLandmarkerWorker.postMessage(
                        {
                            action: 'pose_landmarker_init',
                            canvas: this.poseLandmarkerOffscreenCanvas,
                            option: {
                                isDrawDetectedPoseLandmarker: this.isDrawDetectedPoseLandmarker,
                            },
                        },
                        [this.poseLandmarkerOffscreenCanvas]
                    );
                    this.alreadyInitPoseLandmarkerOffscreenCanvas = true;
                } else {
                    this.sendImageBitmapForPoseLandmarker();
                }
            } else {
                await this.initPredictPoseLandmarker();
                this.predictPoseLandmarker();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async startFaceLandmarker() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            if (!this.isInitFaceLandmarker) {
                this.initFaceLandmarker();
            }
            this.isRunningFaceLandmarker = true;

            if (this.canWorker) {
                if (!this.alreadyInitFaceLandmarkerOffscreenCanvas) {
                    this.faceLandmarkerWorker.postMessage(
                        {
                            action: 'face_landmarker_init',
                            canvas: this.faceLandmarkerOffscreenCanvas,
                            option: {
                                isDrawDetectedFaceLandmarker: this.isDrawDetectedFaceLandmarker,
                            },
                        },
                        [this.faceLandmarkerOffscreenCanvas]
                    );
                    this.alreadyInitFaceLandmarkerOffscreenCanvas = true;
                } else {
                    this.sendImageBitmapForFaceLandmarker();
                }
            } else {
                await this.initPredictFaceLandmarker();
                this.predictFaceLandmarker();
            }
        } catch (e) {
            console.error(e);
        }
    }

    async startObjectDetector() {
        try {
            if (!this.stream) {
                await this.turnOnWebcam();
            }
            if (!this.isInitObjectDetector) {
                this.initObjectDetector();
            }
            this.isRunningObjectDetector = true;

            if (this.canWorker) {
                if (!this.alreadyInitObjectDetectorOffscreenCanvas) {
                    this.objectDetectorWorker.postMessage(
                        {
                            action: 'object_detector_init',
                            canvas: this.objectDetectorOffscreenCanvas,
                            option: {
                                isDrawDetectedObjectDetector: this.isDrawDetectedObjectDetector,
                            },
                        },
                        [this.objectDetectorOffscreenCanvas]
                    );
                    this.alreadyInitObjectDetectorOffscreenCanvas = true;
                } else {
                    this.sendImageBitmapForObjectDetector();
                }
            } else {
                await this.initPredictObjectDetector();
                this.predictObjectDetector();
            }
        } catch (e) {
            console.error(e);
        }
    }

    changeDrawDetectedHand(isDrawDetectedHand: boolean) {
        this.isDrawDetectedHand = isDrawDetectedHand;
        this.updateHandGestureRecognition();
    }

    changeDrawDetectedPoseLandmarker(isDrawDetectedPoseLandmarker: boolean) {
        this.isDrawDetectedPoseLandmarker = isDrawDetectedPoseLandmarker;
        this.updatePoseLandmarker();
    }

    changeDrawDetectedFaceLandmarker(isDrawDetectedFaceLandmarker: boolean) {
        this.isDrawDetectedFaceLandmarker = isDrawDetectedFaceLandmarker;
        this.updateFaceLandmarker();
    }

    changeDrawDetectedObjectDetector(isDrawDetectedObjectDetector: boolean) {
        this.isDrawDetectedObjectDetector = isDrawDetectedObjectDetector;
        this.updateObjectDetector();
    }

    updateHandGestureRecognition() {
        if (this.canWorker) {
            this.gestureRecognizerWorker.postMessage({
                action: 'gesture_recognizer_change_option',
                option: {
                    isDrawDetectedHand: this.isDrawDetectedHand,
                },
            });
        }
    }

    updatePoseLandmarker() {
        if (this.canWorker) {
            this.poseLandmarkerWorker.postMessage({
                action: 'pose_landmarker_change_option',
                option: {
                    isDrawDetectedPoseLandmarker: this.isDrawDetectedPoseLandmarker,
                },
            });
        }
    }

    updateFaceLandmarker() {
        if (this.canWorker) {
            this.faceLandmarkerWorker.postMessage({
                action: 'face_landmarker_change_option',
                option: {
                    isDrawDetectedFaceLandmarker: this.isDrawDetectedFaceLandmarker,
                },
            });
        }
    }

    updateObjectDetector() {
        if (this.canWorker) {
            this.objectDetectorWorker.postMessage({
                action: 'object_detector_change_option',
                option: {
                    isDrawDetectedObjectDetector: this.isDrawDetectedObjectDetector,
                },
            });
        }
    }

    async stopHandGestureRecognition() {
        this.isRunningHandGesture = false;
        this.isPrevHandDetected = false;
        this.countDetectedHand = 0;
        if (this.canWorker) {
            this.gestureRecognizerWorker.postMessage({
                action: 'clear_gesture_recognizer',
            });
        } else {
            this.gestureRecognizerVideoCanvasCtx.clearRect(
                0,
                0,
                this.video.width,
                this.video.height
            );
        }
    }

    async stopPoseLandmarker() {
        this.isRunningPoseLandmarker = false;
        this.isPrevPoseLandmarker = false;
        this.countDetectedPose = 0;
        if (this.canWorker) {
            this.poseLandmarkerWorker.postMessage({
                action: 'clear_pose_landmarker',
            });
        } else {
            this.poseLandmarkerVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);
        }
    }

    async stopFaceLandmarker() {
        this.isRunningFaceLandmarker = false;
        this.isPrevFaceLandmarker = false;
        this.countDetectedFace = 0;
        if (this.canWorker) {
            this.faceLandmarkerWorker.postMessage({
                action: 'clear_face_landmarker',
            });
        } else {
            this.faceLandmarkerVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);
        }
    }

    async stopObjectDetector() {
        this.isRunningObjectDetector = false;
        this.isPrevObjectDetector = false;
        this.countDetectedObject = 0;
        if (this.canWorker) {
            this.objectDetectorWorker.postMessage({
                action: 'clear_object_detector',
            });
        } else {
            this.objectDetectorVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);
        }
    }

    async initPredictHandGesture() {
        const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: '/lib/entry-js/extern/model/gesture_recognizer.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
        });
    }

    async initPredictPoseLandmarker() {
        const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: '/lib/entry-js/extern/model/pose_landmarker_lite.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 4,
        });
    }

    async initPredictFaceLandmarker() {
        const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: '/lib/entry-js/extern/model/face_landmarker.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 4,
        });
    }

    async initPredictObjectDetector() {
        const vision = await FilesetResolver.forVisionTasks('/lib/entry-js/extern/wasm');
        this.objectDetector = await ObjectDetector.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: '/lib/entry-js/extern/model/face_landmarker.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            scoreThreshold: 0.5,
            maxResults: 8,
        });
    }

    async predictHandGesture() {
        try {
            let results;

            if (!this.gestureRecognizerVideoCanvasCtx || this.isRunningHandGesture === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictHandGesture();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const startTimeMs = Date.now();
                results = this.gestureRecognizer.recognizeForVideo(this.video, startTimeMs);
            } else {
                return;
            }
            this.gestureRecognizerVideoCanvasCtx.save();
            this.gestureRecognizerVideoCanvasCtx.clearRect(
                0,
                0,
                this.video.width,
                this.video.height
            );

            const { landmarks, handednesses } = results;
            this.prevGestureRecognizerResult = results;
            if (landmarks.length) {
                if (!this.isPrevHandDetected) {
                    this.isPrevHandDetected = true;
                    Entry.engine.fireEvent('when_hand_detection');
                }
                if (landmarks.length !== this.countDetectedHand) {
                    this.countDetectedHand = landmarks.length;
                }
                if (!this.isDrawDetectedHand) {
                    return;
                }

                landmarks.forEach((landmark, i) => {
                    let connectColor;
                    let landmarkColor;
                    const [handedness] = handednesses[i];
                    const mark12 = landmark[12];
                    this.gestureRecognizerVideoCanvasCtx.scale(-1, 1);
                    if (handedness.categoryName === 'Left') {
                        this.gestureRecognizerVideoCanvasCtx.fillStyle = '#FF0000';
                        this.gestureRecognizerVideoCanvasCtx.fillText(
                            `${i + 1}-오른손`,
                            -mark12.x * 640,
                            mark12.y * 360 - 20
                        );
                        connectColor = '#FF0000';
                        landmarkColor = '#00FF00';
                    } else {
                        this.gestureRecognizerVideoCanvasCtx.fillStyle = '#00FF00';
                        this.gestureRecognizerVideoCanvasCtx.fillText(
                            `${i + 1}-왼손`,
                            -mark12.x * 640,
                            mark12.y * 360 - 20
                        );
                        connectColor = '#00FF00';
                        landmarkColor = '#FF0000';
                    }
                    this.gestureRecognizerVideoCanvasCtx.scale(-1, 1);
                    this.gestureRecognizerDrawingUtils.drawConnectors(
                        landmark,
                        GestureRecognizer.HAND_CONNECTIONS,
                        {
                            color: connectColor,
                            lineWidth: 4,
                        }
                    );
                    this.gestureRecognizerDrawingUtils.drawLandmarks(landmark, {
                        color: connectColor,
                        lineWidth: 4,
                        fillColor: landmarkColor,
                        radius: (e) => this.getYX(e.from!.z || 0),
                    });
                });
            } else {
                this.isPrevHandDetected = false;
                this.countDetectedHand = 0;
            }
        } finally {
            this.gestureRecognizerVideoCanvasCtx.restore();
            if (this.isRunningHandGesture === true) {
                window.requestAnimationFrame(this.predictHandGesture.bind(this));
            }
        }
    }

    async predictPoseLandmarker() {
        try {
            let results;

            if (!this.poseLandmarkerVideoCanvasCtx || this.isRunningPoseLandmarker === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictPoseLandmarker();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const startTimeMs = performance.now();
                results = await this.poseLandmarker.detectForVideo(this.video, startTimeMs);
            } else {
                return;
            }
            this.poseLandmarkerVideoCanvasCtx.save();
            this.poseLandmarkerVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);

            const { landmarks } = results;
            this.prevPoseLandmarkerResult = results;
            if (landmarks.length) {
                if (!this.isPrevPoseLandmarker) {
                    this.isPrevPoseLandmarker = true;
                    Entry.engine.fireEvent('when_pose_landmarker');
                }
                if (landmarks.length !== this.countDetectedPose) {
                    this.countDetectedPose = landmarks.length;
                }
                if (!this.isDrawDetectedPoseLandmarker) {
                    return;
                }

                landmarks.forEach((landmark, i) => {
                    this.poseLandmarkerDrawingUtils.drawLandmarks(landmark, {
                        radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
                    });
                    this.poseLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        PoseLandmarker.POSE_CONNECTIONS
                    );
                });
            } else {
                this.isPrevPoseLandmarker = false;
                this.countDetectedPose = 0;
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.poseLandmarkerVideoCanvasCtx.restore();
            if (this.isRunningPoseLandmarker === true) {
                window.requestAnimationFrame(this.predictPoseLandmarker.bind(this));
            }
        }
    }

    async predictFaceLandmarker() {
        try {
            let results;

            if (!this.faceLandmarkerVideoCanvasCtx || this.isRunningFaceLandmarker === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictFaceLandmarker();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const startTimeMs = performance.now();
                results = await this.faceLandmarker.detectForVideo(this.video, startTimeMs);
            } else {
                return;
            }
            this.faceLandmarkerVideoCanvasCtx.save();
            this.faceLandmarkerVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);

            const { faceLandmarks } = results;
            this.prevFaceLandmarkerResult = results;
            if (faceLandmarks.length) {
                if (!this.isPrevFaceLandmarker) {
                    this.isPrevFaceLandmarker = true;
                    Entry.engine.fireEvent('when_face_landmarker');
                }
                if (faceLandmarks.length !== this.countDetectedFace) {
                    this.countDetectedFace = faceLandmarks.length;
                }
                if (!this.isDrawDetectedFaceLandmarker) {
                    return;
                }

                faceLandmarks.forEach((landmark, i) => {
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                        {
                            color: '#C0C0C070',
                            lineWidth: 1,
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                        {
                            color: '#FF3030',
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                        { color: '#FF3030' }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                        {
                            color: '#30FF30',
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                        {
                            color: '#30FF30',
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                        {
                            color: '#E0E0E0',
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_LIPS,
                        {
                            color: '#E0E0E0',
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
                        {
                            color: '#FF3030',
                        }
                    );
                    this.faceLandmarkerDrawingUtils.drawConnectors(
                        landmark,
                        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
                        {
                            color: '#30FF30',
                        }
                    );
                });
            } else {
                this.isPrevFaceLandmarker = false;
                this.countDetectedFace = 0;
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.faceLandmarkerVideoCanvasCtx.restore();
            if (this.isRunningFaceLandmarker === true) {
                window.requestAnimationFrame(this.predictFaceLandmarker.bind(this));
            }
        }
    }

    async predictObjectDetector() {
        try {
            let results;

            if (!this.objectDetectorVideoCanvasCtx || this.isRunningObjectDetector === false) {
                return;
            }
            if (this.video.readyState < 2) {
                await this.sleep();
                this.predictObjectDetector();
                return;
            }
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const startTimeMs = performance.now();
                results = await this.objectDetector.detectForVideo(this.video, startTimeMs);
            } else {
                return;
            }
            this.objectDetectorVideoCanvasCtx.save();
            this.objectDetectorVideoCanvasCtx.clearRect(0, 0, this.video.width, this.video.height);

            const { detections } = results;
            this.prevObjectDetectorResult = results;
            if (detections.length) {
                if (!this.isPrevObjectDetector) {
                    this.isPrevObjectDetector = true;
                    Entry.engine.fireEvent('when_face_landmarker');
                }
                if (detections.length !== this.countDetectedObject) {
                    this.countDetectedObject = detections.length;
                }
                if (!this.isDrawDetectedObjectDetector) {
                    return;
                }
            } else {
                this.isPrevObjectDetector = false;
                this.countDetectedObject = 0;
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.objectDetectorVideoCanvasCtx.restore();
            if (this.isRunningObjectDetector === true) {
                window.requestAnimationFrame(this.predictObjectDetector.bind(this));
            }
        }
    }

    getHandPointAxis(hand: number, handPoint: number) {
        if (!this.prevGestureRecognizerResult) {
            return;
        }
        const { landmarks } = this.prevGestureRecognizerResult;
        if (!landmarks.length) {
            return;
        }
        const landmark = landmarks[hand];
        const pointAxis = landmark[handPoint];
        return {
            x: -pointAxis.x * this.STAGE_WIDTH + this.STAGE_WIDTH / 2,
            y: -pointAxis.y * this.STAGE_HEIGHT + this.STAGE_HEIGHT / 2,
            z: pointAxis.z,
        };
    }

    getPosePointAxis(pose: number, posePoint: number) {
        if (!this.prevPoseLandmarkerResult) {
            return;
        }
        const { landmarks } = this.prevPoseLandmarkerResult;
        if (!landmarks.length) {
            return;
        }
        const landmark = landmarks[pose];
        const pointAxis = landmark[posePoint];
        return {
            x: -pointAxis.x * this.STAGE_WIDTH + this.STAGE_WIDTH / 2,
            y: -pointAxis.y * this.STAGE_HEIGHT + this.STAGE_HEIGHT / 2,
            z: pointAxis.z,
        };
    }

    getFacePointAxis(face: number, facePoint: number) {
        if (!this.prevFaceLandmarkerResult) {
            return;
        }
        const { faceLandmarks } = this.prevFaceLandmarkerResult;
        if (!faceLandmarks.length) {
            return;
        }
        const landmark = faceLandmarks[face];
        const pointAxis = landmark[facePoint];
        return {
            x: -pointAxis.x * this.STAGE_WIDTH + this.STAGE_WIDTH / 2,
            y: -pointAxis.y * this.STAGE_HEIGHT + this.STAGE_HEIGHT / 2,
            z: pointAxis.z,
        };
    }

    getObjectPointAxis(face: number, facePoint: number) {
        if (!this.prevObjectDetectorResult) {
            return;
        }
        const { detections } = this.prevObjectDetectorResult;
        if (!detections.length) {
            return;
        }
        const detect = detections[face];
        return detect.boundingBox;
    }

    getHandedness(hand: number) {
        if (!this.prevGestureRecognizerResult) {
            return;
        }
        const { handednesses } = this.prevGestureRecognizerResult;
        if (!handednesses.length) {
            return;
        }
        return handednesses[hand][0];
    }

    getGesture(hand: number) {
        if (!this.prevGestureRecognizerResult) {
            return;
        }
        const { gestures } = this.prevGestureRecognizerResult;
        if (!gestures.length) {
            return;
        }
        return gestures[hand][0];
    }

    reset() {
        if (this.isInitGestureRecognition) {
            this.changeDrawDetectedHand(false);
            this.stopHandGestureRecognition();
            this.prevGestureRecognizerResult = undefined;
        }
        if (this.isInitPoseLandmarker) {
            this.changeDrawDetectedPoseLandmarker(false);
            this.stopPoseLandmarker();
            this.prevPoseLandmarkerResult = undefined;
        }
        if (this.isInitFaceLandmarker) {
            this.changeDrawDetectedFaceLandmarker(false);
            this.stopFaceLandmarker();
            this.prevFaceLandmarkerResult = undefined;
        }
        if (this.isInitObjectDetector) {
            this.changeDrawDetectedObjectDetector(false);
            this.stopObjectDetector();
            this.prevObjectDetectorResult = undefined;
        }
        this.turnOffWebcam();
    }

    destroy() {
        this.isInitialized = false;
        console.log('destroy');
    }
}

export default singleInstance(MediaPipeUtils);
