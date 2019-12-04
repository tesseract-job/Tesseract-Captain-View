<template>
  <div class="app-container">
    <el-row>
      <el-button type="success" @click="addEntity">添加实体</el-button>
    </el-row>
    <el-row>
      <div id="entity-graph"></div>
    </el-row>


    <!-- 添加实体 dialog-->
    <el-dialog v-el-drag-dialog :visible.sync="addEntityDialogVisible" title="实体信息">
      <el-form ref="entityForm" :inline="false" :model="curEntityInfo" :rules="entityRules" label-width="120px">
        <el-form-item label="实体展示名" prop="entityShowName">
          <el-input ref="name" v-model="curEntityInfo.entityShowName" placeholder="实体名"/>
        </el-form-item>
        <el-form-item label="实体名" prop="entityName">
          <el-input ref="name" v-model="curEntityInfo.entityName" placeholder="实体名"/>
        </el-form-item>
        <el-form-item label="实体描述" prop="entityDescription">
          <el-input v-model="curEntityInfo.entityDescription" type="textarea"/>
        </el-form-item>
        <!--        <el-form-item label="关联实体" prop="relationEntity">-->
        <!--          <el-select v-model="curEntityInfo.relationEntityName" placeholder="关联实体">-->
        <!--            <el-option v-for="entity in entityList" :label="entity.entityName" :value="entity.entityName"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="saveEntity">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加属性 dialog-->
    <el-dialog v-el-drag-dialog :visible.sync="addFieldDialogVisible" title="属性信息">
      <el-form ref="fieldForm" :inline="false" :model="curFieldInfo" :rules="fieldRules" label-width="120px">
        <el-form-item label="实体名" prop="entityName">
          {{curFieldInfo.entityName}}
        </el-form-item>
        <el-form-item label="属性展示名" prop="fieldShowName">
          <el-input v-model="curFieldInfo.fieldShowName" placeholder="属性名"/>
        </el-form-item>
        <el-form-item label="属性名" prop="fieldName">
          <el-input ref="fieldName" v-model="curFieldInfo.fieldName" placeholder="属性名"/>
        </el-form-item>
        <el-form-item label="属性描述" prop="fieldDescription">
          <el-input v-model="curFieldInfo.fieldDescription" type="textarea"/>
        </el-form-item>
        <el-form-item label="属性类型" prop="fieldType">
          <el-select v-model="curFieldInfo.fieldType" placeholder="属性类型">
            <el-option v-for="fieldType in fieldTypeList" :label="fieldType.name" :value="fieldType.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doAddField">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


    <!-- 右键实体选择框 dialog-->
    <el-dialog v-el-drag-dialog width="20%" center :visible.sync="contextmenuDialogVisible" title="操作">
      <el-form ref="entityForm" :inline="false" :model="curEntityInfo" :rules="entityRules">
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="addField">新增属性</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="relationEntity">关联实体</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="addEntityBehavior">新增实体行为</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 右键关联实体 dialog-->
    <el-dialog v-el-drag-dialog width="40%" center :visible.sync="contextmenuRelationEntityDialogVisible" title="关联实体">
      <el-form ref="relationEntityForm" :inline="false" :model="needRelationEntity" :rules="needRelationEntityRules"
               label-width="120px">
        <el-form-item label="当前实体名" prop="curEntityName">
          {{curClickNodeData.name}}
        </el-form-item>
        <el-form-item label="关联展示名" prop="relationShowName">
          <el-input v-model="needRelationEntity.relationShowName" placeholder="关联展示名"/>
        </el-form-item>
        <el-form-item label="关联属性名" prop="relationName">
          <el-input v-model="needRelationEntity.relationName" placeholder="关联属性名<数据库关联用>"/>
        </el-form-item>
        <el-form-item label="关联实体" prop="relationEntityName">
          <el-select v-model="needRelationEntity.relationEntityName" placeholder="关联实体">
            <el-option v-for="entity in entityList" v-if="entity.entityName != needRelationEntity.curEntityName"
                       :label="entity.entityName"
                       :value="entity.entityName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="关联描述" prop="relationDescription">
          <el-input v-model="needRelationEntity.relationDescription" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="doRelationEntity">关联</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 右键增加实体行为 dialog-->
    <el-dialog v-el-drag-dialog width="50%" center :visible.sync="contextmenuEntityBehaviorDialogVisible" title="实体行为">
      <el-form ref="entityBehaviorForm" :inline="false" :model="entityBehavior" :rules="entityBehaviorRules"
               label-width="120px">
        <el-form-item label="当前实体名:" prop="curEntityName">
          {{entityBehavior.curEntityName}}
        </el-form-item>
        <el-form-item label="行为展示名:" prop="behaviorShowName">
          <el-input v-model="entityBehavior.behaviorShowName" placeholder="行为展示名"/>
        </el-form-item>
        <el-form-item label="方法名:" prop="behaviorMethodName">
          <el-input v-model="entityBehavior.behaviorMethodName" placeholder="行为方法名"/>
        </el-form-item>
        <!-- 方法参数列表-->
        <el-form-item label="方法参数列表:" prop="behaviorMethodName">
          <el-button type="success" size="mini" @click="addArg">添加</el-button>
          <el-table
            :data="entityBehavior.argArr"
            :highlight-current-row=true
            border
            style="width: 100%" size="mini">
            <el-table-column
              align="center"
              prop="argName"
              label="参数名"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="argType"
              label="参数类型"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="argDescription"
              label="描述">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="方法返回值类型:" prop="behaviorMethodReturnType">
          <el-input v-model="entityBehavior.behaviorMethodReturnType" placeholder="方法返回值类型"/>
        </el-form-item>
        <el-form-item label="行为描述:" prop="behaviorDescription">
          <el-input v-model="entityBehavior.behaviorDescription" type="textarea"/>
        </el-form-item>
        <el-form-item label="行为关联实体:" prop="relationEntityName">
          <el-select v-model="entityBehavior.relationEntityName" placeholder="关联实体">
            <el-option v-for="entity in entityList" v-if="entity.entityName != entityBehavior.curEntityName"
                       :label="entity.entityName" :value="entity.entityName"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doAddEntityBehavior">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--右键添加方法参数-->
    <el-dialog v-el-drag-dialog width="40%" center :visible.sync="methodArgDialogVisible" title="方法参数">
      <el-form ref="relationEntityForm" :inline="false" :model="methodArg" :rules="methodArgRules"
               label-width="120px">
        <el-form-item label="参数名" prop="argName">
          <el-input v-model="methodArg.argName" placeholder="参数名"/>
        </el-form-item>
        <el-form-item label="参数类型" prop="argType">
          <el-input v-model="methodArg.argType" placeholder="参数类型"/>
        </el-form-item>
        <el-form-item label="关联描述" prop="argDescription">
          <el-input v-model="methodArg.argDescription" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="doAddArg">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import commonUtils from '@/utils/commonUtils'
  import elDragDialog from '@/directive/el-drag-dialog'
  import constant from './constant'
  import echarts from 'echarts'

  let defaultEntitySize = 50
  let defaultBehaviorSize = 35
  let defaultRelationSize = 25
  let defaultFieldSize = 15
  let chartDatas = [{
    name: 'test1',
    value: 'test1',
    draggable: true,
    symbolSize: defaultEntitySize
  }, {
    name: 'test2',
    value: 'test2',
    draggable: true,
    symbolSize: defaultEntitySize
  }]
  let chartLinks = []
  let option = {
    title: {
      text: '实体关系图',
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    animation: true,
    series: [
      {
        name: '实体关系图',
        type: 'graph',
        layout: 'force',
        data: chartDatas,
        links: chartLinks,
        categories: [],
        roam: true,
        label: {
          position: 'right',
          show: true,
          fontSize: 20

        },
        force: {
          repulsion: 400,
          gravity: 0.1,
          edgeLength: [100, 500]
        }
      }
    ]
  }
  let charts
  export default {
    name: 'entity-graph',
    directives: { elDragDialog },
    data() {
      return {
        entityList: [{ entityName: 'test1', entityDescription: null },
          { entityName: 'test2', entityDescription: null }],
        fieldList: [],
        relationList: [],
        behaviorList: [],

        //添加实体
        addEntityDialogVisible: false,
        entityRules: {},
        curEntityInfo: { entityName: null, entityShowName: null, entityDescription: null },

        //添加属性
        addFieldDialogVisible: false,
        fieldRules: {},
        curFieldInfo: { fieldName: null, fieldShowName: null, fieldDescription: null, fieldType: 1, entityName: null },
        fieldTypeList: constant.fieldTypeList,

        //右键操作选择
        contextmenuDialogVisible: false,
        curClickNodeData: {},

        //右键关联实体
        contextmenuRelationEntityDialogVisible: false,
        needRelationEntity: {
          curEntityName: null,
          relationEntityName: null,
          relationName: null,
          relationShowName: null,
          relationDescription: null
        },
        needRelationEntityRules: {},

        //右键新增实体行为
        contextmenuEntityBehaviorDialogVisible: false,
        //实体行为
        entityBehavior: {
          //当前实体名
          curEntityName: null,
          //行为关联实体名字
          relationEntityName: null,
          //展示名
          behaviorShowName: null,
          //行为方法名
          behaviorMethodName: null,
          //行为方法返回值类型
          behaviorMethodReturnType: null,
          //参数数组
          argArr: [{ argName: 'test', argType: 'string', argDescription: 'argDescription' }],
          //行为描述
          behaviorDescription: null
        },
        entityBehaviorRules: {},
        //添加方法参数
        methodArgDialogVisible: false,
        methodArg: {
          argName: null,
          argType: null,
          argDescription: null
        },
        methodArgRules: {}
      }
    },
    mounted() {
      charts = echarts.init(document.getElementById('entity-graph'))
      charts.setOption(option)
      //去除默认鼠标右键
      document.oncontextmenu = function() {
        return false
      }
      charts.on('contextmenu', params => {
        let data = params.data
        //添加实体属性
        this.curClickNodeData = data
        this.contextmenuDialogVisible = true
      })
    }
    ,
    methods: {
      addEntity() {
        commonUtils.clearObject(this.curEntityInfo)
        this.addEntityDialogVisible = true
      }
      ,
      saveEntity() {
        let entity = {}
        Object.assign(entity, this.curEntityInfo)
        //添加到实体结点
        this.entityList.push(entity)
        this.updateChart([{
          name: entity.entityShowName,
          value: entity,
          type: 'entity',
          symbolSize: defaultEntitySize,
          draggable: true,
          itemStyle: {
            color: '#dc153e'
          }
        }], [])
        this.addEntityDialogVisible = false
      }
      ,
      relationEntity() {
        commonUtils.clearObject(this.needRelationEntity)
        this.needRelationEntity.curEntityName = this.curClickNodeData.name
        this.contextmenuRelationEntityDialogVisible = true
      }
      ,
      doRelationEntity() {
        let relation = {}
        Object.assign(relation, this.needRelationEntity)
        //保存关系结点
        this.relationList.push(relation)
        this.updateChart([{
          name: relation.relationShowName,
          value: relation,
          type: 'relation',
          symbolSize: defaultRelationSize,
          draggable: true,
          itemStyle: {
            color: '#dc840c'
          }
        }], [{
          source: relation.curEntityName,
          target: relation.relationShowName
        }, {
          source: relation.relationEntityName,
          target: relation.relationShowName
        }])
        this.contextmenuRelationEntityDialogVisible = false
      }
      ,
      addEntityBehavior() {
        commonUtils.clearObject(this.entityBehavior)
        this.entityBehavior.curEntityName = this.curClickNodeData.name
        this.contextmenuEntityBehaviorDialogVisible = true
      }
      ,
      doAddEntityBehavior() {
        let behavior = {}
        Object.assign(behavior, this.entityBehavior)
        //保存行为结点
        this.behaviorList.push(behavior)
        this.updateChart([{
          name: behavior.behaviorShowName,
          value: behavior,
          type: 'behavior',
          symbolSize: defaultBehaviorSize,
          draggable: true,
          itemStyle: {
            color: '#dc2c9a'
          }
        }], [{
          source: behavior.curEntityName,
          target: behavior.behaviorShowName
        }, {
          source: behavior.relationEntityName,
          target: behavior.behaviorShowName
        }])
        this.contextmenuEntityBehaviorDialogVisible = false
      }
      ,
      addField() {
        commonUtils.clearObject(this.curFieldInfo)
        this.curFieldInfo.entityName = this.curClickNodeData.name
        this.addFieldDialogVisible = true
      }
      ,
      doAddField() {
        let field = {}
        Object.assign(field, this.curFieldInfo)
        //添加到实体列表
        this.fieldList.push(field)
        this.updateChart([{
          name: field.fieldShowName,
          value: field,
          symbolSize: defaultFieldSize,
          draggable: true,
          type: 'field',
          itemStyle: {
            color: '#26dc3b'
          }
        }], [{ source: field.fieldShowName, target: field.entityName }])
        this.addFieldDialogVisible = false
      }
      ,
      addArg() {
        this.methodArgDialogVisible = true
      }
      ,
      doAddArg() {
        this.entityBehavior.argArr.push(this.methodArg)
        this.methodArgDialogVisible = false
      }
      ,
      updateChart(dataArr, linkArr) {
        debugger
        let flag = false
        if (dataArr && dataArr instanceof Array) {
          for (let data of dataArr) {
            flag = true
            chartDatas.push(data)
          }
        }
        if (linkArr && linkArr instanceof Array) {
          for (let link of linkArr) {
            flag = true
            chartLinks.push(link)
          }
        }
        if (flag) {
          charts.setOption(option)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #entity-graph {
    width: 100%;
    height: 600px;
  }
</style>
