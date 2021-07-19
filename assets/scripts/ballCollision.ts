
import { _decorator, Component, Node, CircleCollider2D, Contact2DType, AudioSource, find, AudioClip, IPhysics2DContact, RigidBody2D, clamp, ERigidBody2DType, Vec2, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { TouchHandler } from './touchHandler';
import { LevelManager } from './levelManager';

@ccclass('BallCollision')
export class BallCollision extends Component {
    
    col:CircleCollider2D = null!;
    audioManager:AudioSource = null!;
    RB2D:RigidBody2D=null!;
    camera:Node = null!;

    @property(AudioClip)
    wood_Hit_Clip:AudioClip = null!;


    start () {
       this.col = this.node.getComponent(CircleCollider2D)!;
       this.audioManager = find('Canvas/audioManager')?.getComponent(AudioSource)!
       this.camera = find('Canvas/Camera')!;
       this.RB2D = this.node.getComponent(RigidBody2D)!;

       this.col.on(Contact2DType.BEGIN_CONTACT,this.contact,this);
       this.col.on(Contact2DType.END_CONTACT, this.endContact, this);
    }
    contact(selfCollider: CircleCollider2D, otherCollider: any, contact: IPhysics2DContact | null){
        var vel = this.RB2D.linearVelocity;
        var magnitude = vel.x*vel.x+vel.y*vel.y;


        if(otherCollider.node.name == "walls"){
            this.audioManager.volume = clamp(Math.abs(magnitude) / 100,0,0.8);
            this.audioManager.clip = this.wood_Hit_Clip;
            this.audioManager.play();
        }

        if(otherCollider.node.name == "hole"){
            if(magnitude < 15){
                TouchHandler.ifHoleIn = true;
                LevelManager.currentLevel += 1;
                var openLevel = find(`Canvas/Layout/level_${LevelManager.currentLevel}`)!;
                openLevel.active = true;
                var colPos = otherCollider.node.getComponent(CircleCollider2D).offset;
                this.RB2D.linearVelocity = new Vec2(0,0);
                tween(this.node)
                .to(1,{position: new Vec3(colPos.x,colPos.y,0)},{easing:'bounceInOut'})
                .start();
                this.scheduleOnce(() =>{tween(this.camera)
                .to(1,{position: new Vec3(this.camera.position.x,this.camera.position.y+750,0)},{easing:'sineInOut'})
                .start();
                },1)
                this.scheduleOnce(() =>{
                    var cLevel = find(`Canvas/Layout/level_${LevelManager.currentLevel-1}`)!;
                    cLevel.destroy();
                },3)
            }else{
                this.RB2D.linearDamping = 10;
            }
        }
        
    }

    endContact(selfCollider: CircleCollider2D, otherCollider: any, contact: IPhysics2DContact | null) {
        if(otherCollider.node.name){
            this.RB2D.linearDamping = 1;
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
