
import { _decorator, Component, Node, SystemEventType, Vec3, tween, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuToGame')
export class MenuToGame extends Component {

    isClicked:Boolean = false;


    start () {
        this.node.on(SystemEventType.TOUCH_START,this.callBackFunc,this);
    }

    callBackFunc(){
        if(this.isClicked == false){
            var CAM = this.node.parent!.children[0];
            director.preloadScene('gameScene',()=>{console.log("scene loaded")});
            tween(CAM)
            .to(1,{position:new Vec3(CAM.position.x,CAM.position.y+900,CAM.position.z)},{easing:'sineInOut'})
            .union()
            .start();
            this.scheduleOnce(()=>{director.loadScene('gameScene')},1.5);
            this.isClicked = true;
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
