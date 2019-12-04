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
        <el-form-item label="实体名" prop="entityName">
          <el-input ref="name" v-model="curEntityInfo.entityName" placeholder="实体名"/>
        </el-form-item>
        <el-form-item label="实体描述" prop="entityDescription">
          <el-input v-model="curEntityInfo.entityDescription" type="textarea"/>
        </el-form-item>
        <el-form-item label="关联实体" prop="relationEntity">
          <el-select v-model="curEntityInfo.relationEntity" placeholder="关联实体">
            <el-option v-for="entity in entityList" :label="entity.entityName" :value="entity.entityName"/>
          </el-select>
        </el-form-item>
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
          <el-button type="primary" @click="saveField">保存</el-button>
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
    <el-dialog v-el-drag-dialog width="20%" center :visible.sync="contextmenuRelationEntityDialogVisible" title="关联实体">
      <el-form ref="relationEntityForm" :inline="false" :model="needRelationEntity" :rules="needRelationEntityRules">
        <el-form-item label="当前实体名" prop="curEntityName">
          {{curClickNodeData.name}}
        </el-form-item>
        <el-form-item label="关联实体" prop="relationEntityName">
          <el-select v-model="needRelationEntity.relationEntityName" placeholder="关联实体">
            <el-option v-for="entity in entityList" :label="entity.entityName" :value="entity.entityName"/>
          </el-select>
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
          {{curClickNodeData.name}}
        </el-form-item>
        <el-form-item label="行为展示名:" prop="behaviorShowName">
          <el-input v-model="entityBehavior.behaviorShowName" placeholder="行为展示名"/>
        </el-form-item>
        <el-form-item label="行为方法名:" prop="behaviorMethodName">
          <el-input v-model="entityBehavior.behaviorMethodName" placeholder="行为方法名"/>
        </el-form-item>
        <!-- 方法参数列表-->
        <el-form-item label="方法参数列表:" prop="behaviorMethodName">
          <el-button type="success" size="mini">添加</el-button>
          <el-table
            :data="entityBehavior.argArr"
            highlight-current-row="true"
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

        <el-form-item label="行为方法返回值类型:" prop="behaviorMethodReturnType">
          <el-input v-model="entityBehavior.behaviorMethodReturnType" placeholder="行为方法返回值类型"/>
        </el-form-item>
        <el-form-item label="行为描述:" prop="behaviorDescription">
          <el-input v-model="entityBehavior.behaviorDescription" type="textarea"/>
        </el-form-item>
        <el-form-item label="行为关联实体:" prop="relationEntityName">
          <el-select v-model="entityBehavior.relationEntityName" placeholder="关联实体">
            <el-option v-for="entity in entityList" :label="entity.entityName" :value="entity.entityName"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doRelationEntity">确定</el-button>
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
  let defaultFieldSize = 20
  let chartDatas = [{
    name: 'test1',
    value: 'test1',
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
          repulsion: 300,
          edgeLength: 300
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
        entityList: [{
          entityName: 'test1',
          value: 'test1',
          draggable: true,
          symbolSize: defaultEntitySize
        }],
        fieldList: [],

        //添加实体
        addEntityDialogVisible: false,
        entityRules: {},
        curEntityInfo: { entityName: null, entityDescription: null, relationEntity: null },

        //添加属性
        addFieldDialogVisible: false,
        fieldRules: {},
        curFieldInfo: { fieldName: null, fieldDescription: null, fieldType: 1, entityName: null },
        fieldTypeList: constant.fieldTypeList,

        //右键操作选择
        contextmenuDialogVisible: false,
        curClickNodeData: {},

        //右键关联实体
        contextmenuRelationEntityDialogVisible: false,
        needRelationEntity: { relationEntityName: null },
        needRelationEntityRules: {},

        //右键新增实体行为
        contextmenuEntityBehaviorDialogVisible: false,
        //实体行为
        entityBehavior: {
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
        entityBehaviorRules: {}
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
    },
    methods: {
      addEntity() {
        commonUtils.clearObject(this.curEntityInfo)
        this.addEntityDialogVisible = true
      },
      saveEntity() {
        let entity = {}
        Object.assign(entity, this.curEntityInfo)
        let graphEntity = {
          name: entity.entityName,
          value: entity.entityName,
          type: 'entity',
          symbolSize: defaultEntitySize,
          draggable: true,
          itemStyle: {
            color: '#dc153e'
          }
        }
        //添加到实体结点
        this.entityList.push(entity)
        //添加echarts并刷新图表
        chartDatas.push(graphEntity)
        //如果有关联实体则添加关联
        if (entity.relationEntity) {
          chartLinks.push({ source: entity.entityName, target: entity.relationEntity })
        }
        charts.setOption(option)
        this.addEntityDialogVisible = false
      },
      relationEntity() {
        this.contextmenuRelationEntityDialogVisible = true
      },
      doRelationEntity() {

      },
      addEntityBehavior() {
        this.contextmenuEntityBehaviorDialogVisible = true
      },
      doAddEntityBehavior() {

      },
      addField() {
        commonUtils.clearObject(this.curFieldInfo)
        this.curFieldInfo.entityName = this.curClickNodeData.name
        this.addFieldDialogVisible = true
      },
      saveField() {
        let field = {}
        Object.assign(field, this.curFieldInfo)
        let graphField = {
          name: field.fieldName,
          value: field.fieldName,
          symbolSize: defaultFieldSize,
          draggable: true,
          type: 'field',
          itemStyle: {
            color: '#dca12f'
          }
        }
        //添加到实体列表
        this.fieldList.push(field)
        //添加echarts结点
        chartDatas.push(graphField)
        //添加属性与实体的关联
        chartLinks.push({ source: field.fieldName, target: field.entityName })
        charts.setOption(option)
        this.addFieldDialogVisible = false
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
