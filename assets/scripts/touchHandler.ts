
import { _decorator, Component, SystemEventType, Vec2, EventTouch, Node, Vec3, math, Graphics, game, RigidBody2D, find} from 'cc';
const { ccclass, property } = _decorator;


@ccclass('TouchHandler')
export class TouchHandler extends Component {

    touchPos:Vec2 = null!;

    RB2D:RigidBody2D = null!;

    @property(Node)
    strength: Node = null!;

    @property(Node)
    ballPos:Node = null!;

    shootVec2:Vec2 = new Vec2(0,0);

    cameraMain:Node = null!;

    ifBallMoving:Boolean =false;
    public static ifHoleIn:Boolean = false;

    start () {
        this.RB2D = this.node.getComponent(RigidBody2D)!;
        this.node.on(SystemEventType.TOUCH_START,this.touchStarted,this);
        this.node.on(SystemEventType.TOUCH_CANCEL,this.touchEnded,this);
        this.node.on(SystemEventType.TOUCH_END,this.touchEnded,this);
        this.node.on(SystemEventType.TOUCH_MOVE,this.touchMove,this);
        //RESET SCALE
        this.strength.setScale(1,0,10);
        this.cameraMain = find('Canvas/GAME_MAIN/Camera')!;
    }

    touchStarted(event:EventTouch){
        if(this.ifBallMoving == false){
            event.propagationStopped = true;
            this.touchPos = event.getUILocation().add(new Vec2(this.cameraMain.position.x,this.cameraMain.position.y));
        }
    }

    touchEnded(event:EventTouch,){
    if(this.ifBallMoving == false){
        //RESET TOUCH POS
    this.touchPos = new Vec2(0,0);
    //RESET SCALE
    this.strength.setScale(1,0,10)
    //APPLY FORCE TO BALL
    //this.RB2D.linearVelocity = new Vec2(this.shootVec2.multiply(new Vec2(-1,-1)))
    var divideNum = 1;
    if(Math.abs(this.shootVec2.x)>Math.abs(this.shootVec2.y) && Math.abs(this.shootVec2.x)>100){
      divideNum = 100 / Math.abs(this.shootVec2.x)
    }
    if(Math.abs(this.shootVec2.y)>Math.abs(this.shootVec2.x) && Math.abs(this.shootVec2.y)>100){
        divideNum = 100 / Math.abs(this.shootVec2.y)
    }
    if(Math.abs(this.shootVec2.y)==Math.abs(this.shootVec2.x) && Math.abs(this.shootVec2.y)>100){
        divideNum = 100 / Math.abs(this.shootVec2.y)
    }

    var force = this.shootVec2.multiply2f(-divideNum,-divideNum);

    this.RB2D.applyForceToCenter(force,true);

    }
    }

    touchMove(event:EventTouch){
    if(this.ifBallMoving == false){
        event.propagationStopped = true;
    var tmp = event.getUILocation().add(new Vec2(this.cameraMain.position.x,this.cameraMain.position.y));
    var tmpWorld = this.ballPos.getWorldPosition()

    //CALCULATE SCALE
    var st = Vec2.distance(tmp,this.touchPos)/2
    st = math.clamp(st,0,50)
    var mVec3 = new Vec3(1,st/50,1)
    this.strength.setScale(mVec3)
    //CALCULATE ROT
    var tmpVec2  = new Vec2(tmp.x-tmpWorld.x,tmp.y-tmpWorld.y).divide(new Vec2(2,2));;
    var tmpRadian = Math.atan2(tmpVec2.y,tmpVec2.x)
    var tmpAngle = tmpRadian * (360/(Math.PI*2))
    this.strength.setRotationFromEuler(0,0,tmpAngle-270);

    //APPLY SHOOT VEC2
    this.shootVec2 = tmpVec2;
    }
    }

    update(deltaTime:number){
        var vel = this.RB2D.linearVelocity;
        var magnitude = vel.x*vel.x+vel.y*vel.y;
    if(magnitude < 0.3 && TouchHandler.ifHoleIn == false){
        this.ifBallMoving = false;
        this.RB2D.linearVelocity = new Vec2(0,0);
    }else{
        this.ifBallMoving = false;
    }
    }

}
