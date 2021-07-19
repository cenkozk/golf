
import { _decorator, Component, Node, TiledMap, Vec3, PolygonCollider2D, RigidBody2D, ERigidBody2DType, Vec2, instantiate, find, CircleCollider2D, macro } from 'cc';
const { ccclass, property } = _decorator;
import CLIPPER from 'polygon-clipping';

@ccclass('ColGenerator')
export class ColGenerator extends Component {

    tiledMap:TiledMap = null!;
    
    walls:Node = null!;
    hole:Node = null!;

    mapData:Array<any> = [];
    mapColliderData:Array<CLIPPER.Geom> = []  //[   [[[0,0],[1,0],[1,1],[0,1],[0,0]]]  ,   [[[1,0],[2,0],[2,1],[1,1],[1,0]]],   [[[0,1],[1,1],[1,2],[0,2],[0,1]]]   ];

    mapPolygonColliderData:Array<PolygonCollider2D> = [];


    async start () {

        macro.ENABLE_TILEDMAP_CULLING = false;

        this.tiledMap = this.node.getComponent(TiledMap)!;
        var layer = this.tiledMap.getLayer("walls")!;
        //hole
        var hole = this.tiledMap.getLayer("hole")!;
        var is1Hole:Boolean = true;
        var holeRB = hole.addComponent(RigidBody2D)!;
        holeRB.type = ERigidBody2DType.Static;

        var layerSize = this.tiledMap!._mapSize;
        var height = layerSize.height;
        var width = layerSize.width;

        this.walls = this.node.getChildByName("walls")!;

        var RB2D = this.walls?.addComponent(RigidBody2D)!
        RB2D.type = ERigidBody2DType.Static;    



        var num = 0;

        for (let h = 0; h < height; h++) {

                this.mapData[h] = [];
            for (let w = 0; w < width; w++) {

                    var GIDA = layer!.getTileGIDAt(w,h)
                    var HOLEGIDA = hole.getTileGIDAt(w,h);
                    this.mapData[h].push(GIDA);
                    var pos = new Vec3(-(height*32/2)+(32*w),(width*32/2)-(32*h),0)
                    if(HOLEGIDA == 6 && is1Hole == true){
                        var holeCol = hole.addComponent(CircleCollider2D)!;
                        holeCol.sensor = true;
                        holeCol.offset = new Vec2(pos.x+16,pos.y-16);
                        holeCol.radius = 9;
                        holeCol.enabled = false
                        holeCol.enabled = true;
                    }
                    if(GIDA != 0){   
                        this.mapColliderData.push([[[pos.x,pos.y],[pos.x+32,pos.y],[pos.x+32,pos.y-32],[pos.x,pos.y-32],[pos.x,pos.y]]])
                        num++
                    }else{
                    }

                    //console.log((h+1)*16 + " " + (w+1)*16 + " " + GIDA)
                    //console.log((-(height*32/2)+(32*w)) + " " + ((width*32/2)-(h*32)))

                    if(w == width - 1 && h == height - 1){
                        console.log(`Done! colliderCount = ${num}`);
                        var firstGeom = this.mapColliderData[0];
                        this.mapColliderData.shift();
                        var createdPolygons = CLIPPER.union(firstGeom,...this.mapColliderData);

                        for (let first = 0; first < createdPolygons.length; first++) {
                            for (let second = 0; second < 1; second++) {

                                var pCollider = this.walls?.addComponent(PolygonCollider2D);
                                var polygonVec2Array:Array<Vec2> = [];

                                if(createdPolygons[first].length>1){
                                    for (let i = 0; i < createdPolygons[first].length; i++) {
                                        for (let elements = 0; elements < createdPolygons[first][i].length; elements++) {
                                            var currentPoly = createdPolygons[first][i][elements]
                                            var tmpVec2 = new Vec2(currentPoly[0],currentPoly[1])
                                            polygonVec2Array.push(tmpVec2);
                                        }
                                    }
                                    
                                    pCollider!.points = polygonVec2Array;
                                    this.mapPolygonColliderData.push(pCollider!);


                                }else{
                                    for (let elements = 0; elements < createdPolygons[first][second].length; elements++) {
                                        var currentPoly = createdPolygons[first][second][elements]
                                        var tmpVec2 = new Vec2(currentPoly[0],currentPoly[1])
                                        polygonVec2Array.push(tmpVec2);
                                    }

                                    pCollider!.points = polygonVec2Array;
                                    this.mapPolygonColliderData.push(pCollider!);


                                }

                                
                                
                            }
                            
                        }
                        this.mapPolygonColliderData.forEach(element => {
                            element.enabled = false
                            element.enabled = true
                        });


                        
                    }              
            }
        }

        //COL VAR//
        /*var COL = this.tiledMap.getObjectGroup("COL")?.getObjects();
        console.log(COL);
        var obj = COL![0];
        this.colliderCheck.setPosition(-(height*32/2)+(obj.offset!.x)-32,(width*32/2)-(obj.offset!.y)+32,0)
        this.colliderCheck.setScale(obj.width/32,obj.height/32,1);
        console.log(new Vec3((obj.width/(obj.width/32)),(obj.height/(-obj.height/32*2)),0))
        var pos = this.colliderCheck.getPosition().add(new Vec3((obj.width/(obj.width/32)),(obj.height/(-obj.height/32*2)),0))
        this.colliderCheck.setPosition(pos); */

        
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
