<template>
    <div class="data-search-container">
        <div class="data-search-header">
            <div class="search-input-wrapper">
                <el-input ref="searchInput" :placeholder="$t('PlaceSearch.enterKeywordsSearch')" clearable v-model="filterText"
                    @clear="clearLayerAndResetData" @keyup.enter.native="handleSearch" @change="handleChangeFilterText"
                    style="height: 30px;line-height: 30px;width: 100%;font-size: 12px;">
                </el-input>
            </div>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="handleSearch" style="width: 50px;
                    height: 30px;
                    border-radius: 2px;">
            </el-button>
        </div>
        <div class="data-search-body">
            <div style="width: 100%;padding-right: 20px;box-sizing: border-box;">
                <el-divider content-position="right" class="collapse">
                    <!-- 可点击的文字区域 -->
                    <div class="collapse-title" @click="toggleForm" :class="{ active: isFormVisible }">
                        <span>{{ $t('PlaceSearch.searchOptions') }}</span>
                        <i class="icon"
                            :class="{ 'el-icon-arrow-up': isFormVisible, 'el-icon-arrow-down': !isFormVisible }">
                        </i>
                    </div>
                </el-divider>
            </div>
            <!-- 表单区域（带过渡动画） -->
            <transition name="collapse">
                <div class="form-content" v-show="isFormVisible">
                    <el-form :model="formData" class="demo-form" label-width="70px" :rules="rules" ref="ruleForm">
                        <!-- 示例表单项，你可以根据需求替换/新增 -->
                        <el-form-item :label="$t('PlaceSearch.searchScope')" prop="searchMethod">
                            <el-radio-group v-model="formData.searchMethod" @change="handleChangeSearchMethod">
                                <el-radio label="view">{{ $t('PlaceSearch.withinSight') }}</el-radio>
                                <el-radio label="administrative">{{ $t('PlaceSearch.administrativeDistrict') }}</el-radio>
                                <el-radio label="layer">{{ $t('PlaceSearch.layerRange') }}</el-radio>
                            </el-radio-group>

                        </el-form-item>
                        <el-form-item :label="$t('PlaceSearch.selectLayer2')" prop="layerId" v-show="formData.searchMethod == 'layer'"
                            style="margin-bottom: 2px;">
                            <el-select v-model="formData.layerId" :placeholder="$t('PlaceSearch.selectLayer')" @change="handleChangelayerId">
                                <el-option v-for="item in clipOptions" :key="item.value" :label="item.label"
                                    :value="item.value">
                                    {{ item.name }}
                                </el-option>
                            </el-select>
                            <el-checkbox style="margin: 2px 0 0;font-weight:400" :disabled="!formData.useFeatureInput"
                                @change="handleChnageUseFeatureInputtoCropGeometry" v-model="formData.useFeatureInputtoCropGeometry
                                    ">{{ $t('PlaceSearch.useGraphicsRangeOnly') }}
                                <el-tooltip effect="light" placement="right" :content="$t('PlaceSearch.layrsContnngMultplShapsSe')">
                                    <img style="vertical-align: sub;" src="@/assets/image/HAToolbox/info.svg"
                                        :alt="$t('PlaceSearch.message')" />
                                </el-tooltip>
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item :label="$t('PlaceSearch.administrativeDistrict2')" v-show="formData.searchMethod == 'administrative'">
                            <el-row>
                                <el-col style="padding-left: 0;width: 30%;">
                                    <el-select class="input-data-select" v-model="selectedProvince" :placeholder="$t('PlaceSearch.province')"
                                        filterable @change="handleProvinceChange">
                                        <el-option v-for="province in provinceData" :key="province.value"
                                            :label="province.label" :value="province.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col style="margin: 0 5%;width: 30%;">
                                    <el-select class="input-data-select" popper-class="larger-length"
                                        v-model="selectedCity" :placeholder="$t('PlaceSearch.city')" clearable filterable
                                        :disabled="!selectedProvince" @change="handleCityChange">
                                        <el-option v-for="city in cityData" :key="city.value" :label="city.label"
                                            :value="city.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col style="padding-right: 0;width: 30%;">
                                    <el-select class="input-data-select" v-model="selectedDistrict" :placeholder="$t('PlaceSearch.district')"
                                        clearable filterable :disabled="!selectedCity" @change="handleInputChange">
                                        <el-option v-for="district in districtData" :key="district.value"
                                            :label="district.label" :value="district.value"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </div>
            </transition>
            <div style="height: 50%;flex: 1;">
                <div class="list-title" v-show="total">
                    <span style="font-weight: bold;">{{ $t('PlaceSearch.searchResults') }}</span>
                    <span>({{ $t('PlaceSearch.totalData') }}: {{ total }})</span>
                </div>
                <!-- 空数据提示 -->
                <!-- <el-empty :image-size="200" description="暂无地点数据" ></el-empty> -->
                <div class="empty-tip" v-if="searchList.length === 0">{{ $t('PlaceSearch.noSearchContentYet') }}</div>
                <!-- 地点列表渲染 -->
                <div v-else class="poi-list" id="scroll-container">
                    <div :class="{ 'poi-item': true, 'poi-item-active': item.activeStatus }"
                        v-for="(item, index) in searchList" :key="item.hotPointID || index">
                        <div>
                            <el-checkbox style="margin: -2px 0 0;" v-model="item.checkedStatus"
                                @change="handleCheckedChange($event, item)"></el-checkbox>
                        </div>
                        <div style="margin: 2px 4px 0;">
                            <img :src="getFileIcon(index + 1, item.activeStatus)" alt="">
                        </div>
                        <div @click.stop="handleClickPoint(item, index)" style="flex:1;width: 50%;">
                            <!-- 地点名称 -->
                            <div class="poi-name">
                                <!-- <span class="label">名称：</span> -->
                                <span style="font-family: Microsoft YaHei;
                                    font-weight: 400;
                                    font-size: 12px;
                                    color: #333333;">
                                    {{ item.name }}
                                </span>
                            </div>

                            <!-- 地址 -->
                            <div class="poi-address">
                                <span class="label">{{ $t('PlaceSearch.address') }}</span>
                                <span class="value">{{ item.address }}</span>
                            </div>

                            <!-- 经纬度（拆分成经度/纬度展示，更易读） -->
                            <div class="poi-lonlat">
                                <span class="label">{{ $t('PlaceSearch.latitudeLongitude') }}</span>
                                <span class="value">
                                    {{ $t('PlaceSearch.longitude') }}{{ item.lonlat.split(',')[0] }}, {{ $t('PlaceSearch.latitude') }}{{ item.lonlat.split(',')[1] }}
                                </span>
                            </div>

                            <!-- 联系电话（处理空值，为空时显示“无”） -->
                            <div class="poi-phone">
                                <span class="label">{{ $t('PlaceSearch.telephone') }}</span>
                                <span class="value">{{ item.phone || $t('PlaceSearch.none') }}</span>
                            </div>

                            <!-- 其他辅助信息（按需展示） -->
                            <div class="poi-other">
                                <span class="label">{{ $t('PlaceSearch.type') }}</span>
                                <span class="value">{{ item.typeName }}</span>
                                <!-- <span class="label ml-2">数据来源：</span>
                                <span class="value">{{ item.source }}</span> -->
                            </div>
                        </div>

                    </div>
                    <div style="flex-shrink: 0;margin: 0 auto;height: 20px;padding: 0 ;box-sizing: border-box;background-color: #fff;"
                        v-show="total">
                        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10"
                            :pager-count="5" layout="prev, pager, next" :total="total">
                        </el-pagination>
                    </div>
                </div>

            </div>
        </div>
        <el-divider class="diver-class" v-if="searchList.length !== 0"></el-divider>
        <div class="data-search-footer" v-show="searchList.length !== 0">
            <el-checkbox :disabled="!total" :indeterminate="isIndeterminate" v-model="checkAll"
                @change="handleCheckAllChange">{{ $t('PlaceSearch.selectAll') }}</el-checkbox>
            <el-button size="small" type="primary" @click="handleClickOpenDialog"
                :disabled="!checkAll && !isIndeterminate">{{ $t('PlaceSearch.addAsFile') }}</el-button>
        </div>
        <el-dialog :title="$t('PlaceSearch.addAsFile')" :visible.sync="isDialogShow" @close="closeDialog" :modal="false"
            :close-on-click-modal="false" v-dialogDrag tabIndex="-1" v-dialog-keyboard="keyboardConfig" top="240px"
            left="500px" customClass="addFile-dialog " ref="addFileDialog">
            <div>
                <el-form :model="addFileForm" label-position="right" label-width="auto" class="p-10"
                    style="padding-bottom: 0;" :rules="rules" ref="addFileForm">
                    <el-form-item :label="$t('PlaceSearch.saveMethod')">
                        <el-radio-group v-model="addFileForm.saveMethod" @change="handleChangeSaveMethod">
                            <el-radio label="current">{{ $t('PlaceSearch.currentFileAdded') }}</el-radio>
                            <el-radio label="new">{{ $t('PlaceSearch.addNewFile') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('PlaceSearch.currentFile')" prop="currentFile" v-if="addFileForm.saveMethod == 'current'">
                        <el-select class="input-data-select" v-model="addFileForm.currentFile" :placeholder="$t('PlaceSearch.selectCurrentFile')"
                            clearable @change="handleCurrentFileChanged">
                            <el-option v-for="vectorLayer in vectorLayers" :key="vectorLayer.id"
                                :label="vectorLayer.label" :value="vectorLayer.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('PlaceSearch.name')" prop="name" v-if="addFileForm.saveMethod == 'new'">
                        <el-input ref="nameInput" v-model="addFileForm.name" class="name"
                            :placeholder="$t('PlaceSearch.enterName')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('PlaceSearch.storagePath')" prop="createPath" v-if="addFileForm.saveMethod == 'new'">
                        <div class="choose-container">
                            <el-input v-model="addFileForm.createPath" disabled></el-input>
                            <div class="file-picker-button">
                                <img src="../../assets/image/rasterExport/file.svg" @click="chooseSavePath" alt="">
                            </div>
                        </div>

                    </el-form-item>

                    <el-form-item :label="$t('PlaceSearch.storageFormat')" prop="storageFormat" v-if="addFileForm.saveMethod == 'new'">
                        <el-select v-model="addFileForm.storageFormat" @change="handleStorageFormatChange">
                            <el-option v-for="item in storageFormat" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <!-- <el-form-item label="要素类型:" prop="geometryType" v-if="addFileForm.saveMethod == 'new'">
                        <el-select v-model="addFileForm.geometryType">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>
            </div>
            <template v-slot:footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="addAsFile" :loading="loadingStatus">{{ $t('PlaceSearch.save') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <file-tree ref="fileTree" @getTargetNode="getTargetNode" :need-path="true"></file-tree>
    </div>
</template>
<script>
import HALayerType from '@/HAGisComponents/HALayers/HALayerType';
import fileTree from 'hacloudstorageweb/src/components/fileTree'
import api from '@/request/api';
import { Feature } from 'ol';
import { WKT } from 'ol/format';
import { Vector as VectorLayer } from 'ol/layer';
import { transform, transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Fill, Icon, Style } from 'ol/style';
import Point from 'ol/geom/Point.js';
import { mapState } from 'vuex';
import { createWKBInstance } from '@/util/createWKBInstance';
import { setFeaturePropertyValue } from '../ribbonToolBar/vector/dialog/common';
export default {
    computed: {
        ...mapState(["project"]),
        keyboardConfig() {
            return {
                Escape: () => {
                    this.isDialogShow = false;
                },
                Enter: this.transformCenter,
            };
        },
    },

    components: {
        fileTree,
    },

    data() {
        return {
            // 按钮加载状态
            loadingStatus: false,
            // 等待图层添加的状态
            waitingLayerAddStatus: false,
            // 保存弹窗
            isDialogShow: false,
            selectedNodeDataInfo: null,
            options: [
                {
                    label: this.$t('PlaceSearch.point'),
                    value: 1,
                },
                {
                    label: this.$t('PlaceSearch.multipoint'),
                    value: 4,
                }
            ],
            storageFormat: [
                // 存储格式
                {
                    label: this.$t('PlaceSearch.postgisVectorPgv'),
                    value: 'pgv',
                    suffix: '.pgv'
                },
                {
                    label: this.$t('PlaceSearch.geopackageVectorGpv'),
                    value: 'gpkg',
                    suffix: '.gpv'
                },
                {
                    label: this.$t('PlaceSearch.esriShapefileShp'),
                    value: 'shp',
                    suffix: '.shp',
                },
            ],
            rules: {
                name: [
                    { required: true, message: this.$t('PlaceSearch.enterName'), trigger: "blur" },
                    { max: 128, message: this.$t('PlaceSearch.nameCanntExcd128Charctrs'), trigger: "blur" },
                    { validator: this.nameValidator, trigger: "blur" },
                ],
                createPath: [
                    { required: true, message: this.$t('PlaceSearch.selectStoragePath'), trigger: "blur" },
                ],
                currentFile: [
                    { required: true, message: this.$t('PlaceSearch.selectSpecifiedFile'), trigger: "change" },
                ],
            },
            // 添加文件的表单
            addFileForm: {
                saveMethod: 'current',
                currentFile: undefined,
                name: '',
                projection: 'EPSG:4326',
                geometryType: 1,
                hasMValue: false,
                hasZValue: false,
                createPath: '用户空间/默认',
                storageFormat: 'pgv'

            },
            // 当前项目的所有矢量图层
            vectorLayers: [],
            isIndeterminate: false,
            checkAll: false,
            filterText: '',
            // 控制表单展开/收起的状态，初始为收起
            isFormVisible: false,
            // 当前的条数起始位置
            currentStartNum: 0,
            currentPage: 1,
            total: 0,
            // 表单数据模型
            formData: {
                searchMethod: 'view',
                seaechType: '',
                layerId: '',
                useFeatureInput: false,
                useFeatureInputtoCropGeometry: false,
            },
            // 展示的搜索列表
            searchList: [],
            // 行政区数据
            regionTreeData: [],
            selectedProvince: '156110000',
            selectedCity: '',
            selectedDistrict: '',
            provinceData: [],
            cityData: [],
            districtData: [],
            // 搜索范围下拉列表
            clipOptions: [
            ],
        }
    },

    watch: {
        project(newValue) {
            this.clearLayerAndResetData();
        },
    },

    created() {
        this.administrativeLayer = null
        this.pointLayer = null
    },

    mounted() {
        this.map = this.$global.gisTool.map;
        this.map.on("layersAdded", this.handleLayersAdded);
        this.map.on("layerAdded", this.initProjectDataList);
        this.map.on("layerCleared", this.initProjectDataList);
        this.map.on("layerRemoved", this.initProjectDataList);
        this.$LegendEventBus.$on("layerOrderChanged", this.initProjectDataList);
        this.HASelectInteraction = this.$global.gisTool.interactions.selectInteraction
        this.initProjectDataList()
        this.initVectorLayer()
        if (this.project) {
            this.clearLayerAndResetData();
        }
    },

    destroyed() {
        this.map.un("layersAdded", this.handleLayersAdded);
        this.map.un("layerAdded", this.initProjectDataList);
        this.map.un("layerCleared", this.initProjectDataList);
        this.map.un("layerRemoved", this.initProjectDataList);
        this.$LegendEventBus.$off("layerOrderChanged", this.initProjectDataList);
        this.clearLayerAndResetData()
    },

    methods: {

        /**
         * @description: 打开弹窗
         * @return {*}
         */
        handleClickOpenDialog() {
            if (this.isDialogShow) return
            this.isDialogShow = true;
            let path = '用户空间/' + this.$store.state.project.workDir
            this.$nextTick(() => {
                this.$refs.fileTree.getFolderInfoByPath(path).then(res => {
                    this.selectedNodeDataInfo = Object.assign({}, res.result)
                    this.selectedNodeDataInfo.path = this.$store.state.project.workDir
                    this.getTargetNode(this.selectedNodeDataInfo)
                })
            })

        },

        /**
         * @description: 处理改变保存格式
         * @return {*}
         */
        handleChangeSaveMethod() {
            // 清除表单校验信息
            this.$nextTick(() => {
                this.$refs.addFileForm.clearValidate()
            })
            // console.log(this.addFileForm)
        },

        // 存储格式变化
        handleStorageFormatChange(val) {

        },

        /**
         * 选择存储路径点击
         */
        chooseSavePath() {
            this.$refs.fileTree.show('path')
        },

        /**
         * 获取目标节点 子组件调用
         * @param node
         */
        getTargetNode(node) {
            this.addFileForm.createPath = node.path
            let nodeData = node.data || node
            this.selectedNodeDataInfo = {
                classify: nodeData.classify,
                containerId: nodeData.containerId,
                folderId: nodeData.id,
                groupId: nodeData.groupId,
                storageId: nodeData.storageId,
                path: node.path
            }
        },

        /**
         * 文件名验证
         * @param rule
         * @param value
         * @param callback
         */
        nameValidator(rule, value, callback) {
            // 特殊字符
            let reg = /[\\/:*?"<>|[\]]/;
            if (reg.test(value) || value.trim() === '') {
                callback(new Error(this.$t('PlaceSearch.nameCanntContnSpeclCharct')));
            } else {
                callback();
            }
        },

        /**
         * @description: 关闭弹窗
         * @return {*}
         */
        closeDialog() {
            this.isDialogShow = false
            const originalForm = this.$options.data().addFileForm;
            // 只重置需要的字段，避免不必要的响应式更新
            this.addFileForm.saveMethod = originalForm.saveMethod;
            this.addFileForm.currentFile = originalForm.currentFile; // 重置为 undefined
            this.addFileForm.name = originalForm.name;
            this.addFileForm.projection = originalForm.projection;
            this.addFileForm.geometryType = originalForm.geometryType;
            this.addFileForm.hasMValue = originalForm.hasMValue;
            this.addFileForm.hasZValue = originalForm.hasZValue;
            this.addFileForm.createPath = originalForm.createPath;
            this.addFileForm.storageFormat = originalForm.storageFormat;
            this.$nextTick(() => {
                this.$refs.addFileForm.clearValidate()
            })
        },

        /**
         * @description: 改变当前选中的图层
         * @param {*} layerId
         * @return {*}
         */
        handleCurrentFileChanged(layerId) {
            let currentLayer = this.map.getLayerById(layerId)
        },

        /**
         * 分页切换后重置滚动条到顶部（支持平滑滚动）
         * @param {String} containerId - 带滚动条的div容器ID
         * @param {Boolean} smooth - 是否平滑滚动
         */
        resetScrollToTop(containerId, smooth = false) {
            const scrollContainer = document.getElementById(containerId);
            if (scrollContainer) {
                // 方式A：基础用法（等同于scrollTop）
                // scrollContainer.scrollTo(0, 0);

                // 方式B：配置式（支持平滑滚动）
                scrollContainer.scrollTo({
                    top: 0, // 垂直滚动到顶部
                    left: 0, // 水平滚动到左侧（可选）
                    behavior: smooth ? 'smooth' : 'auto' // auto=瞬间到位，smooth=平滑滚动
                });
            }
        },

        /**
         * @description: 每当改变参数 需要重置搜索结果
         * @param {*} val
         * @return {*}
         */
        handleChangeSearchType(val) {
            this.back()
            this.handleSearch()
        },

        /**
       * 修改feature中的属性表的字段属性
       */
        updateFeatureFieldData(data) {
            let layer = this.map.getLayerById(data.layerId)
            if (data.modifyType === 'add') {
                layer.fields.push({ fieldName: data.fieldName, fieldType: data.fieldType })

            }
            layer.scheme.fields_ = JSON.parse(JSON.stringify(layer.fields))
        },

        /**
       * 修改图层的编辑状态
       */
        updateLayerIsModify() {
            let layer = this.map.getLayerById(this.addFileForm.currentFile)
            layer.isModified = true
        },

        /**
         * @description: 整理wkb
         * @param {*} hex
         * @return {*}
         */
        hexToBytes(hex) {
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
                bytes[j] = parseInt(hex.substr(i, 2), 16);
            }
            return bytes;
        },

        /**
         * @description: 获取当前选中的feature
         * @return {*}
         */
        getCheckedFeatures() {
            // 1. 获取所有选中的check项的hotPointID（修复赋值/比较运算符错误）
            let checkedArray = this.searchList.filter(item => {
                // 注意：这里要用 === 比较，而非 = 赋值
                return item.checkedStatus === true;
            }).map(item1 => item1.hotPointID);

            // 边界处理：如果没有选中任何项，直接返回避免后续无效操作
            if (checkedArray.length === 0) {
                console.warn(this.$t('PlaceSearch.nothingSelected'));
                return []; // 或根据业务需求返回其他值（如null）
            }

            // 2. 获取图层中所有features
            let features = this.pointLayer.getSource().getFeatures();

            // 3. 筛选出hotPointID在checkedArray中的features（补全核心判断逻辑）
            let checkedFeatures = features.filter(feature => {
                // 获取feature的hotPointID，并判断是否在选中的ID数组中
                const featureHotPointID = feature.get('hotpointid');
                return checkedArray.includes(featureHotPointID);
            });

            return checkedFeatures
        },

        /**
         * @description: 往图层里添加字段
         * @param {*} layer
         * @return {*}
         */
        async addFields(layer) {
            let layerFields = layer.fields.map(item => item.fieldName);
            const fieldArray = ['name', 'address', 'hotpointid', 'phone', 'typename'];

            // 筛选出需要添加的字段
            // const needAddFields = fieldArray.filter(fieldName => !layerFields.includes(fieldName));
            // 筛选需要添加的字段：忽略大小写判断是否已存在
            const needAddFields = fieldArray.filter(fieldName => {
                // 把两边都转成小写再判断，忽略大小写
                return !layerFields.some(existField =>
                    existField.toLowerCase() === fieldName.toLowerCase()
                );
            });
            try {
                // 并行添加所有缺失字段
                await Promise.all(
                    needAddFields.map(async (fieldName) => {
                        const fieldsInfo = { addFields: fieldName, fieldsType: 'STRING' };
                        await api.vector.addFields(layer.id, fieldsInfo);

                        const info = {
                            layerId: layer.id,//图层ID
                            modifyType: 'add',//修改类型  add:添加 edit:编辑 delete:删除
                            fieldName: fieldsInfo.addFields,//操作字段名称
                            fieldType: fieldsInfo.fieldsType,//操作字段类型
                            fieldValue: '',//操作字段值
                            oldFieldName: '',//如果是编辑操作，操作之前的名称
                        };

                        this.$PropertyEventBus.notifyTableFieldChanged(info);
                        this.updateFeatureFieldData(info);
                        this.updateLayerIsModify(layer.id);
                        // 暂时注释掉
                        // this.$refs.HAPropertyTable.handleAddCol(data)
                    })
                );
            } catch (error) {
                console.log('Add fields failed', error);
            }
        },

        /**
         * @description: 向图层里添加feature
         * @param {*} layer
         * @return {*}
         */
        addFeatures(layer, checkedFeatures) {
            // 添加feature
            let wkb = createWKBInstance(layer)
            let wkbList = []
            checkedFeatures.map(feature => {
                let wkbRow = this.hexToBytes(wkb.writeGeometry(feature.getGeometry()))
                wkbList.push(wkbRow)
            })
            const byteArrayList = wkbList.map(row => Array.from(row));
            // 访问后端接口 添加要素至图层
            api.vector.addFeature({
                projectDataId: layer.id,
                projectId: this.$store.state.project.id,
                wkbList: byteArrayList
            })
                .then(res => {
                    let resultFids = res.data.result
                    let newFeaturesArray = checkedFeatures.map((feature, index) => {
                        let newFeature = new Feature({})
                        newFeature.setGeometry(feature.getGeometry())
                        newFeature.setId(resultFids[index].fid)
                        setFeaturePropertyValue(layer, newFeature, resultFids[index].attributes)
                        this.$PropertyEventBus.notifyFeaturePropertyEditing(true)
                        layer.getSource().addFeature(newFeature)
                        return {
                            fid: resultFids[index].fid,
                            name: feature.get('name'),
                            address: feature.get('address'),
                            hotpointid: feature.get('hotpointid'),
                            phone: feature.get('phone'),
                            typename: feature.get('typename')
                        }
                    })
                    layer.changed()
                    this.$message({
                        type: 'success',
                        message: this.$t('PlaceSearch.addedSuccessfully')
                    })
                    // 赋值
                    this.addValue(layer, resultFids, newFeaturesArray)
                    this.closeDialog()
                }).finally(() => {
                    this.loadingStatus = false
                })
        },

        /**
       * 修改值触发事件，动态修改feature数据
       */
        updateFeatureData(data) {
            let layer = this.map.getLayerById(data.layerId)
            data.fidList.forEach((item, index) => {
                //获取当前编辑的feature
                let feature = layer.getSource().getFeatureById(item)
                let keys = feature.getKeys()
                //获取修改的列名称
                let filedNames = data.fieldsNameList
                filedNames.forEach((name, nameIndex) => {
                    if (keys.includes(name)) {
                        feature.set(name, data.fieldsValueList[nameIndex][index].value)
                    }
                })
            })
        },

        /**
       * 修改图层的编辑状态
       */
        updateLayerIsModify(id) {
            let layer = this.map.getLayerById(id)
            layer.isModified = true
        },

        /**
         * @description: 向图层里的部分字段赋值
         * @param {*} layer
         * @param {*} resultFids
         * @param {*} newFeaturesArray
         * @return {*}
         */
        addValue(layer, resultFids, newFeaturesArray) {
            const obj = {
                fidList: [],
                fieldsNameList: [],
                fieldsValueList: []
            };
            const fieldArray = ['name', 'address', 'hotpointid', 'phone', 'typename']
            resultFids.forEach((item) => {
                obj.fidList.push(item.fid)
                obj.fieldsNameList = fieldArray
                // 获取对应的feature
                let featureObj = newFeaturesArray.find(feature => feature.fid == item.fid)
                let valueArray = fieldArray.map(fieldName => featureObj[fieldName])
                obj.fieldsValueList.push(valueArray)
            })
            api.vector.updateFieldsValue(layer.id, obj).then(() => {
                // let selection = this.HASelectInteraction.getFeaturesByLayerId(this.layerId)
                // let fids = selection.map(item => String(item.id_))
                const info = {
                    layerId: layer.id,
                    fidList: obj.fidList,
                    fieldsNameList: obj.fieldsNameList,
                    fieldsValueList: []
                };
                //如果选中项有修改的内容时，派发事件
                // let hasSelected = obj.fidList.some(item => fids.includes(item))
                // if (hasSelected) {
                //     //只传选中的被修改数据
                //     info.fidList = obj.fidList.filter(fid => fids.includes(fid))
                // }
                info.fieldsValueList = obj.fieldsNameList.map((fieldName) => {
                    return obj.fidList.map((fid) => {
                        // console.log(newFeaturesArray, fid)
                        let featureObj = newFeaturesArray.find(feature => feature.fid == fid)
                        return {
                            "type": 'STRING',
                            "value": featureObj[fieldName]
                        }
                    })
                }
                )
                // console.log(info)
                // //修改feature数据
                // hasSelected && this.$PropertyEventBus.notifyTableValueChanged(info)
                this.updateFeatureData(info)
                this.$PropertyEventBus.notifyFeaturePropertyEditing(false)
                this.updateLayerIsModify(layer.id)
            }).catch(error => {
                console.error('thrown:', error);
            })
        },

        /**
         * @description: 添加为文件
         * @return {*}
         */
        addAsFile() {
            this.$refs.addFileForm.validate(async (valid) => {
                if (valid) {
                    this.loadingStatus = true
                    let checkedFeatures = this.getCheckedFeatures()
                    // 先判断方式
                    if (this.addFileForm.saveMethod == 'current') {
                        let layer = this.map.getLayerById(this.addFileForm.currentFile)
                        // 向图层里添加字段
                        await this.addFields(layer)
                        // 向图层里添加feature
                        this.addFeatures(layer, checkedFeatures)
                    } else if (this.addFileForm.saveMethod == 'new') {
                        this.addFileForm.suffix = this.storageFormat.find(item => item.value === this.addFileForm.storageFormat).suffix
                        this.addFileForm.fields = {}
                        const fieldArray = ['name', 'address', 'hotpointid', 'phone', 'typename']
                        fieldArray.forEach(fieldName => {
                            // 文本类型为 4 
                            this.addFileForm.fields[fieldName] = 4
                        })
                        // 获取投影对象
                        api.projection.getProjectionFolderByCodeAndAuthname('4326', 'EPSG').then(res => {
                            if (res.data.code === '0') {
                                let result = res.data.result
                                this.createVectorFile(this.addFileForm, result.wkt, this.selectedNodeDataInfo, checkedFeatures)
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },

        /**
         * 接受子组件传过来的数据新建矢量文件
         * @param formData 新建矢量文件数据
         * @param wkt
         * @param node 保存文件的节点信息
         */
        createVectorFile(formData, wkt, node, checkedFeatures) {
            let ascription = 'person';
            if (this.$store.state.user) {
                ascription = this.$store.state.user.userRole ? 'enterprise' : 'person'
            }
            let data = {
                ascription: ascription,
                attribute: 'public',
                classify: node.classify,
                fileName: encodeURIComponent(formData.name + formData.suffix),
                geometryType: formData.geometryType,
                groupId: node.groupId,
                parentId: node.folderId,
                projection: wkt,
                storageId: node.storageId,
                hasZValue: formData.hasZValue,
                hasMValue: formData.hasMValue,
                storageFormat: formData.storageFormat,
                fields: formData.fields
            };
            //保存矢量文件到云盘
            api.cloudDisk.createVectorFile(data).then(res => {
                //项目中添加图层
                let newData = res.data.result;
                newData.id = newData.dataId
                newData.path = node.path
                newData.storageId = node.storageId
                //this.$emit('saveShpFile', newData);
                // this.$global.functionalProxy.handleHAServiceFunction("addLayer")
                // 添加监听添加数据成功事件
                this.$global.functionalProxy.handleHAServiceFunction("addProjectData", newData, this.insertId)
                this.waitingLayerAddStatus = true
                // 考虑添加失败的情况 设置延迟 如果三秒都没成功 将状态置为false
                setTimeout(() => {
                    this.waitingLayerAddStatus = false
                }, 3000)
            }).catch(() => {
                this.loadingStatus = false
            });
        },

        /**
         * @description: 全选改变
         * @return {*}
         */
        handleCheckAllChange(val) {
            this.isIndeterminate = false;
            this.searchList.map(item => {
                item.checkedStatus = val
            })
        },

        /**
         * @description: 单选框改变
         * @return {*}
         */
        handleCheckedChange(value, item) {
            item.checkedStatus = value
            let checkedCount = this.searchList.filter(item => item.checkedStatus).length
            this.checkAll = checkedCount === this.searchList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.searchList.length;
        },

        /**
         * @description: 获取图标
         * @param {*} id
         * @param {*} a
         * @return {*}
         */
        getFileIcon(id, status = false) {
            let color = status ? 'red' : 'blue'
            let iconPath = 'address' + id + color + '.svg'
            return require('@/assets/image/placeSearch/' + iconPath)
        },

        /**
         * @description: 点击单个地点高亮
         * @param {*} id
         * @return {*}
         */
        handleClickPoint(item, index) {
            let id = item.hotPointID
            let activeStatus = !(item.activeStatus ? item.activeStatus : false)
            this.searchList = this.searchList.map(item1 => {
                if (item1.hotPointID == id) {
                    item1.activeStatus = activeStatus
                }
                else {
                    item1.activeStatus = false
                }
                return item1
            })
            let features = this.pointLayer.getSource().getFeatures()
            features.map(feature => {
                const isActive = feature.get('hotpointid') === id; // 是否为当前点击的激活点位
                if (isActive) {
                    feature.set('activeStatus', activeStatus)
                } else {
                    feature.set('activeStatus', false)
                }
                // 2. 定义样式数组：基础圆形 + 可选图标
                const styleArr = [
                    // 基础圆形样式（原有逻辑）
                    // new Style({
                    //     image: new CircleStyle({
                    //         radius: 6,
                    //         fill: new Fill({
                    //             color: isActive ? [0, 255, 0, 1] : [0, 255, 0, 1]
                    //         }),
                    //         stroke: new Stroke({ color: "transparent" }),
                    //     }),
                    // })
                ];
                // 3. 激活状态下，添加上方图标样式
                // if (feature.get('activeStatus')) {
                styleArr.push(
                    new Style({
                        image: new Icon({
                            src: this.getFileIcon(feature.get('index'), feature.get('activeStatus') ? true : false), // 复用你的图标方法
                            // 图标偏移：offsetY 负数向上，正数向下（根据图标大小调整）
                            offsetY: -15, // 向上偏移15px，可根据图标尺寸微调
                            // 可选：设置图标大小（避免图标过大/过小）
                            scale: 1.6, // 缩放比例，1.6表示80%大小
                            // 可选：图标锚点（默认中心点，可调整为底部居中）
                            anchor: [0.5, 1] // [x, y] 0.5=水平居中，1=垂直底部
                        }),
                        zIndex: feature.get('activeStatus') ? 2001 : 2000,
                    })
                );
                // }

                // 4. 设置复合样式（数组形式）
                feature.setStyle(styleArr);
            })
        },

        /**
         * @description: 当前页数发生变化
         * @param {*} val
         * @return {*}
         */
        handleCurrentChange(val) {
            this.currentPage = val
            this.currentStartNum = (this.currentPage - 1) * 10
            this.handleSearch(false)
        },

        /**
         * @description: 返回时 需要清空数据
         * @return {*}
         */
        back() {
            this.administrativeLayer.getSource().clear();
            this.administrativeLayer.setMap(null)
            this.pointLayer.getSource().clear();
            this.pointLayer.setMap(null)
            this.searchList = []
            this.total = 0
            this.currentStartNum = 0
            this.currentPage = 1
            this.handleCheckAllChange(false)
        },

        /**
         * @description: 退出登入时 清空数据
         * @return {*}
         */
        clearLayerAndResetData() {
            this.isFormVisible = false
            this.filterText = ''
            this.formData.layerId = ''
            this.back()
        },

        /**
         * @description: 初始化图层
         * @return {*}
         */
        initVectorLayer() {
            if (!this.administrativeLayer) {
                let administrativeLayer = new VectorLayer({
                    id: "administrativeLayer",
                    zIndex: 2000,
                    source: new VectorSource({}),
                });
                this.administrativeLayer = administrativeLayer;
            } else {
                this.administrativeLayer.getSource().clear();
            }

            if (!this.pointLayer) {
                let pointLayer = new VectorLayer({
                    id: "pointLayer",
                    zIndex: 2002,
                    source: new VectorSource({}),
                });
                this.pointLayer = pointLayer;
            } else {
                this.pointLayer.getSource().clear();
            }
        },

        /**
         * @description: 搜索
         * @return {*}
         */
        handleSearch(loadPloy = true) {
            if (!this.project) {
                this.$message.info(this.$t('PlaceSearch.openProjectFirst'))
                return
            }
            if (!this.filterText) {
                this.$message.info(this.$t('PlaceSearch.enterSearchKeywords'))
                return
            }
            this.$refs['ruleForm'].validate(async (valid) => {
                if (valid) {
                    this.isIndeterminate = false;
                    this.checkAll = false
                    // 先获取区域四至 4326
                    let extent = []
                    // this.administrativeLayer.getSource().clear()
                    let filterText = this.filterText
                    this.searchList = []
                    // 根据不同搜索范围进行不同操作
                    switch (this.formData.searchMethod) {
                        case 'view':
                            this.administrativeLayer.getSource().clear()
                            extent = transformExtent(
                                this.map.getView().calculateExtent(),
                                this.map.projection,
                                'EPSG:4326'
                            );
                            let extentString = extent.join(',')
                            api.tiandituApi.search(filterText, extentString, this.map.getView().getZoom(), this.formData.seaechType, this.currentStartNum).then(res => {
                                this.searchList = res.data.pois.map(item => {
                                    return {
                                        ...item,
                                        checkedStatus: false,
                                        activeStatus: false,
                                    }
                                })
                                this.total = Math.min(res.data.count, 200)
                                this.loadPointFeature()
                            })
                            break;
                        case 'administrative':
                            let specify = this.selectedDistrict ? this.selectedDistrict : this.selectedCity ? this.selectedCity : this.selectedProvince
                            api.tiandituApi.searchByAdministrative(filterText, specify, this.formData.seaechType, this.currentStartNum).then(res => {
                                this.searchList = res.data.pois.map(item => {
                                    return {
                                        ...item,
                                        checkedStatus: false,
                                        activeStatus: false,
                                    }
                                })
                                this.total = Math.min(res.data.count, 200)
                                this.loadPointFeature()
                            })
                            if (!loadPloy) return
                            // 还需要定位到这块区域
                            api.tiandituApi.getAdministrativeBound(specify).then(res => {
                                let boundaryWkt = res.data.data.district[0].boundary
                                // 1. 初始化WKT解析器
                                const wktParser = new WKT();

                                // 2. 核心：解析WKT为Geometry（自动识别为MultiPolygon类型）
                                const geometry = wktParser.readGeometry(boundaryWkt, {
                                    dataProjection: 'EPSG:4326',    // WKT里的坐标是经纬度（WGS84）
                                    featureProjection: this.map.projection  // 转换为OpenLayers默认的Web墨卡托
                                });
                                let feature = new Feature({})
                                feature.setStyle(new Style({
                                    fill: new Fill({
                                        color: [251, 232, 166, 0.50],
                                    }),
                                }))
                                feature.setGeometry(geometry)
                                this.administrativeLayer.getSource().addFeature(feature)
                                this.map.zoomToFeatures([feature])
                                this.administrativeLayer.setMap(this.map.olMapInstance);
                            })
                            break;
                        default:
                            this.administrativeLayer.getSource().clear()
                            let layer = this.map.getLayerById(this.formData.layerId)
                            if (!layer) return
                            if (layer.getSourceExtent()[0] == Infinity) {
                                this.$message.warning(this.$t('PlaceSearch.currentLayerNoDataSwitchLayer'))
                                return
                            }
                            if (layer?.layerType == HALayerType.Polygon && this.formData.useFeatureInputtoCropGeometry) {
                                try {
                                    let polygonStringArray = this.extractFeatureCoords(layer).allCoords
                                    this.searchList = []
                                    console.log(this.extractFeatureCoords(layer))
                                    if (polygonStringArray[0][0].length > 1500) {
                                        // 改用图层四至搜索
                                        // 栅格 矢量 获取
                                        extent = transformExtent(
                                            this.extractFeatureCoords(layer).geos[0].getExtent(),
                                            this.map.projection,
                                            'EPSG:4326'
                                        );
                                        let extentString = extent.join(',')
                                        api.tiandituApi.search(filterText, extentString, this.map.getView().getZoom(), this.formData.seaechType, this.currentStartNum).then(res => {
                                            this.searchList = res.data.pois.map(item => {
                                                return {
                                                    ...item,
                                                    checkedStatus: false,
                                                    activeStatus: false,
                                                }
                                            })
                                            this.total = Math.min(res.data.count, 200)
                                            this.map.zoomToLayer(layer.getLayerExtent())
                                            this.loadPointFeature()
                                        })
                                        return
                                    }

                                    api.tiandituApi.searchByPolygon(
                                        filterText,
                                        polygonStringArray[0][0],
                                        this.formData.seaechType,
                                        this.currentStartNum).then(res => {
                                            this.searchList = res.data.pois.map(item => {
                                                return {
                                                    ...item,
                                                    checkedStatus: false,
                                                    activeStatus: false,
                                                }
                                            })
                                            this.total = Math.min(res.data.count, 200)
                                            this.map.zoomToLayer(layer.getLayerExtent())
                                            this.loadPointFeature()
                                        })
                                } catch (error) {
                                    // 全局错误捕获
                                    console.error(this.$t('PlaceSearch.polygnSearchOverllProcssn'), error);
                                }
                            } else {
                                // 栅格 矢量 获取
                                extent = transformExtent(
                                    layer.getSourceExtent(),
                                    layer.sourceProjectionCode,
                                    'EPSG:4326'
                                );
                                let extentString = extent.join(',')
                                api.tiandituApi.search(filterText, extentString, this.map.getView().getZoom(), this.formData.seaechType, this.currentStartNum).then(res => {
                                    this.searchList = res.data.pois.map(item => {
                                        return {
                                            ...item,
                                            checkedStatus: false,
                                            activeStatus: false,
                                        }
                                    })
                                    this.total = Math.min(res.data.count, 200)
                                    this.map.zoomToLayer(layer.getLayerExtent())
                                    this.loadPointFeature()
                                })
                            }
                            break;
                    }
                } else {
                    return false;
                }
            });
        },

        /**
         * @description: 加载点图层数据
         * @return {*}
         */
        loadPointFeature() {
            this.pointLayer.getSource().clear()
            let lonlatArr = this.searchList.map((item, index) => {
                let mapCoor = transform(item.lonlat.split(','), 'EPSG:4326', this.map.projection)
                let pointFeature = new Feature(new Point(mapCoor))
                pointFeature.set('address', item.address)
                pointFeature.set('hotpointid', item.hotPointID)
                pointFeature.set('lonlat', item.lonlat)
                pointFeature.set('name', item.name)
                pointFeature.set('phone', item.phone)
                pointFeature.set('typename', item.typeName)
                pointFeature.set('activeStatus', false)
                pointFeature.set('index', index + 1)
                pointFeature.setStyle([
                    new Style({
                        image: new Icon({
                            src: this.getFileIcon(pointFeature.get('index'), pointFeature.get('activeStatus') ? true : false), // 复用你的图标方法
                            // 图标偏移：offsetY 负数向上，正数向下（根据图标大小调整）
                            offsetY: -15, // 向上偏移15px，可根据图标尺寸微调
                            // 可选：设置图标大小（避免图标过大/过小）
                            scale: 1.6, // 缩放比例，1.6表示80%大小
                            // 可选：图标锚点（默认中心点，可调整为底部居中）
                            anchor: [0.5, 1] // [x, y] 0.5=水平居中，1=垂直底部
                        }),
                        zIndex: pointFeature.get('activeStatus') ? 2001 : 2000,
                    })])
                this.pointLayer.getSource().addFeature(pointFeature)
                return item.lonlat
            })
            this.pointLayer.setMap(this.map.olMapInstance);
            this.$nextTick(() => {
                // 调用示例（平滑滚动到顶部）
                this.resetScrollToTop('scroll-container', true);
            });
        },

        /**
         * 从图层数据源中提取所有图形的经纬度坐标，格式：x1,y1,x2,y2,...x1,y1
         * @param {import('ol/layer/Layer').default} layer - OpenLayers图层对象
         * @returns {Object} 结果对象：{ allCoords: 所有图形坐标拼接的数组, error: 错误信息 }
         */
        extractFeatureCoords(layer) {
            const result = {
                allCoords: [], // 存储每个图形的坐标字符串（x1,y1,x2,y2,...x1,y1）
                error: null,
                geos: []
            };

            try {
                // 1. 获取图层数据源的所有Feature
                const features = layer.getSource().getFeatures();
                if (features.length === 0) {
                    result.error = this.$t('PlaceSearch.thereNoFeatureDataLayer');
                    return result;
                }

                const sortedFeatures = [...features].sort((a, b) => {
                    const aId = a.getId();
                    const bId = b.getId();
                    if (aId == null && bId == null) return 0;
                    if (aId == null) return 1;
                    if (bId == null) return -1;

                    const aNum = Number(aId);
                    const bNum = Number(bId);
                    const aIsNum = Number.isFinite(aNum);
                    const bIsNum = Number.isFinite(bNum);

                    if (aIsNum && bIsNum) {
                        return aNum - bNum;
                    }
                    return String(aId).localeCompare(String(bId), 'zh-Hans-CN-u-kn-true');
                });

                // 2. 按 Feature ID 升序遍历并提取坐标
                sortedFeatures.forEach((feature, idx) => {
                    const geometry = feature.getGeometry();
                    if (!geometry) {
                        console.warn(`${this.$t('PlaceSearch.feature')} ${idx + 1} ${this.$t('PlaceSearch.noGeometry')}`);
                        return;
                    }
                    result.geos.push(geometry)
                    let coords = [];
                    // 3. 处理不同几何类型的坐标提取
                    coords = geometry.getCoordinates()
                    let wgs84Coords = []
                    if (geometry.getType() === 'MultiPolygon') {
                        // 4. 坐标转换：从Web墨卡托（EPSG:3857）转为经纬度（EPSG:4326）
                        wgs84Coords = coords.map(coord => {
                            let newCoord = coord[0].map(coor => {
                                return transform(coor, layer.layerProjectionCode, 'EPSG:4326');
                            })
                            return newCoord.flat().join(',')

                        });
                    } else if (geometry.getType() === 'Polygon') {
                        // 4. 坐标转换：从Web墨卡托（EPSG:3857）转为经纬度（EPSG:4326）
                        wgs84Coords = [coords[0].map(coor => transform(coor, layer.layerProjectionCode, 'EPSG:4326').join(',')).join(',')]
                    }
                    // 6. 拼接为指定格式：x1,y1,x2,y2,...x1,y1
                    const coordStr = wgs84Coords;
                    result.allCoords.push(coordStr);
                });
            } catch (e) {
                result.error = `${this.$t('PlaceSearch.failedExtractCoordinates')} ${e.message}`;
                console.error(e);
            }

            return result;
        },

        /**
        * 初始化省份下拉数据
        * 把原始树形数据中level=1的节点转换为el-option需要的格式
        */
        initProvinceData() {
            this.provinceData = this.regionTreeData.map(item => ({
                label: item.name,
                value: item.code
            }));
        },

        /**
         * 省份选择变化处理
         * @param {Number} provinceId 选中的省份ID
         */
        handleProvinceChange(provinceId) {
            // 清空城市和区县的选中值及下拉数据
            this.selectedCity = '';
            this.selectedDistrict = '';
            this.cityData = [];
            this.districtData = [];
            if (!provinceId) return;
            this.back()
            this.handleSearch(true)
            // 找到选中的省份节点
            const targetProvince = this.regionTreeData.find(item => item.code === provinceId);
            if (targetProvince && targetProvince.children && targetProvince.children.length) {
                // 把省份下的城市转换为el-option格式
                this.cityData = targetProvince.children.map(item => ({
                    label: item.name,
                    value: item.code
                }));
            }
        },

        /**
         * 城市选择变化处理
         * @param {Number} cityId 选中的城市ID
         */
        handleCityChange(cityId) {
            // 清空区县的选中值及下拉数据
            this.selectedDistrict = '';
            this.districtData = [];
            if (!cityId || !this.selectedProvince) return;
            this.back()
            this.handleSearch(true)
            // 先找到选中的省份，再找到该省份下的目标城市
            const targetProvince = this.regionTreeData.find(item => item.code === this.selectedProvince);
            if (targetProvince) {
                const targetCity = targetProvince.children.find(item => item.code === cityId);
                if (targetCity && targetCity.children && targetCity.children.length) {
                    // 把城市下的区县转换为el-option格式
                    this.districtData = targetCity.children.map(item => ({
                        label: item.name,
                        value: item.code
                    }));
                }
            }
        },

        /**
         * 区县选择变化处理（根据你的业务需求扩展）
         * @param {Number} districtId 选中的区县ID
         */
        handleInputChange(districtId) {
            // console.log('选中的省市区ID：', this.selectedProvince, this.selectedCity, districtId);
            // this.value = this.selectedProvince + '-' + this.selectedCity + '-' + this.selectedDistrict
            this.back()
            this.handleSearch(true)
        },

        /**
         * @description: 获取行政区数据
         * @return {*}
         */
        getRegionData() {
            if (this.regionTreeData.length) return
            api.toolbox.getRegionData().then(res => {
                this.regionTreeData = res.data.result
                // 初始化加载省份数据（level=1的节点）
                this.initProvinceData();
                const [selectedProvince, selectedCity, selectedDistrict] = ["156110000", '', ''];
                this.selectedProvince = selectedProvince ? selectedProvince : '';
                // 找到选中的省份节点
                const targetProvince = this.regionTreeData.find(item => item.code === selectedProvince);
                if (targetProvince && targetProvince.children && targetProvince.children.length) {
                    // 把省份下的城市转换为el-option格式
                    this.cityData = targetProvince.children.map(item => ({
                        label: item.name,
                        value: item.code
                    }));
                }
                this.selectedCity = selectedCity ? selectedCity : '';
                if (selectedCity) {
                    const targetCity = targetProvince.children.find(item => item.code === selectedCity);
                    if (targetCity && targetCity.children && targetCity.children.length) {
                        // 把城市下的区县转换为el-option格式
                        this.districtData = targetCity.children.map(item => ({
                            label: item.name,
                            value: item.code
                        }));
                    }
                }
                this.selectedDistrict = selectedDistrict ? selectedDistrict : '';
                // this.handleInputChange()
            })
        },

        /**
         * @description: 判断是否禁用
         * @return {*}
         */
        handleChangeSearchMethod() {
            this.back()
            if (this.formData.searchMethod == 'administrative') {
                this.getRegionData()
            }
            if (this.formData.searchMethod == 'layer' && !this.formData.layerId && this.clipOptions.length) {
                this.formData.layerId = this.clipOptions[0].value
                // 是否禁用
                this.handleChangelayerId(this.formData.layerId)
            }

        },

        /**
         * @description: 改变关键字
         * @return {*}
         */
        handleChangeFilterText(val) {
            this.back()
            if (val !== '') {
                // this.handleSearch()
            }
        },

        /**
         * @description: 更改check状态
         * @return {*}
         */
        handleChnageUseFeatureInputtoCropGeometry() {
            this.back()
            this.handleSearch()
        },

        /**
         * @description: 改变当前选中的图层 判断是否禁用
         * @return {*}
         */
        handleChangelayerId(layerId) {
            let layer = this.clipOptions.find(
                (layer) => layerId == layer.id
            );
            if (layer?.layerType == HALayerType.Polygon) {
                this.formData.useFeatureInput = true;
            } else {
                this.formData.useFeatureInput = false;
                this.formData.useFeatureInputtoCropGeometry = false;
            }
            this.back()
            this.handleSearch()
        },

        /**
         * @description: 监听图层添加事件
         * @param {*} layers
         * @return {*}
         */
        handleLayersAdded(obj) {
            // 需要监听新建图层事件
            // 首先判断当前是否处于等待新建图层完成的状态
            if (this.waitingLayerAddStatus) {
                let checkedFeatures = this.getCheckedFeatures()
                let layer = obj.layers[0]
                // 向图层里添加feature
                this.addFeatures(layer, checkedFeatures)
                this.waitingLayerAddStatus = false
            }
            this.initProjectDataList()
        },

        /**
         * @description: 初始化图层数据
         * @return {*}
         */
        initProjectDataList() {
            this.clipOptions = [];
            this.vectorLayers = []
            // 考虑图层图的情况
            const processLayer = (layer, isVisibleArr = []) => {
                if (layer.layerType === HALayerType.Group) {
                    layer
                        .getLayers()
                        .getArray()
                        .forEach((innerLayer) => {
                            processLayer(innerLayer, [
                                ...isVisibleArr,
                                innerLayer.getVisible(),
                            ]); // 递归调用处理子图层
                        });
                } else {
                    let obj = {
                        id: layer.id,
                        name: layer.name,
                        label: layer.name,
                        value: layer.id,
                        layerType: layer.layerType,
                        zIndex: layer.getZIndex()
                    };
                    if (
                        layer.layerType == HALayerType.Polygon ||
                        layer.layerType == HALayerType.Raster
                    ) {
                        this.clipOptions.push(obj);
                    }
                    if (
                        layer.layerType === HALayerType.Point) {
                        this.vectorLayers.push(obj)
                    }
                }
            };
            this.map.layers.map((layer) => {
                let obj1 = {
                    id: layer.id,
                    name: layer.name,
                    label: layer.name,
                    value: layer.id,
                    layerType: layer.layerType,
                    zIndex: layer.getZIndex()
                };
                if (
                    layer.layerType == HALayerType.Polygon ||
                    layer.layerType == HALayerType.Raster
                ) {
                    this.clipOptions.push(obj1);
                } else if (layer.layerType == HALayerType.Group) {
                    processLayer(layer);
                } else if (
                    layer.layerType === HALayerType.Point
                ) {
                    this.vectorLayers.push(obj1)
                }
            });
            // 对图层数据进行排序
            if (this.clipOptions.length) {
                this.clipOptions.sort((layer1, layer2) => {
                    return layer2.zIndex - layer1.zIndex;
                });
            }
            if (this.vectorLayers.length) {
                this.vectorLayers.sort((layer1, layer2) => {
                    return layer2.zIndex - layer1.zIndex;
                });
            }
        },

        // 切换表单显示/隐藏状态
        toggleForm() {
            if (!this.project) return
            this.isFormVisible = !this.isFormVisible;
            if (this.formData.searchMethod == 'layer' && !this.formData.layerId && this.clipOptions.length) {
                this.formData.layerId = this.clipOptions[0].value
                // 是否禁用
                this.handleChangelayerId(this.formData.layerId)
            }
        },
    },

}
</script>
<style lang="less" scoped>
.choose-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-button {
        height: 24px;
        padding: 0;
        text-align: center;
        vertical-align: middle;
        // border: 1px solid #3370ff;
        // border-radius: 2px;
        color: #3370ff;
        padding-left: 7px;
        font-size: 12px;
    }
}

.file-picker-button {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    line-height: 22px;
    cursor: pointer;
    display: inline-block;
    margin: 1px 0 0 3px;

    // transform: translate(6px,1px);
    img {
        transform: translate(3px, 3px);
    }

    &:hover {
        background: #E4ECEF;
    }
}

// 定位弹窗的样式
::v-deep .addFile-dialog {
    width: 326px !important;
    // position: absolute;
}

::v-deep .addFile-dialog .el-form-item__label {
    min-width: 75px;
}

.data-search-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    box-sizing: border-box;

    .data-search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 320px;
        height: 55px;
        padding: 5px 20px 0 10px;
        box-sizing: border-box;
        position: relative;

        .search-input-wrapper {
            width: calc(100% - 60px);
            position: relative;
        }

        .search-tree-dropdown {
            position: absolute;
            left: 0;
            top: 34px;
            width: 100%;
            max-height: 260px;
            overflow-y: auto;
            padding: 6px 0;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            z-index: 99;
        }

        .search-tree-empty {
            padding: 8px 14px;
            font-size: 12px;
            color: #999;
        }

        :deep(.el-input__inner) {
            height: 30px !important;
            line-height: 30px !important;
            font-size: 12px;
        }

        :deep(.el-input__suffix) {
            height: 30px !important;
            line-height: 30px !important;
            font-size: 12px;
        }

        :deep(.search-tree-dropdown .el-tree-node__content) {
            height: 28px;
            font-size: 12px;
            padding-right: 8px;
        }

        :deep(.search-tree-dropdown .suggestion-tree-node) {
            display: inline-flex;
            align-items: center;
            width: 100%;
        }

        :deep(.search-tree-dropdown .suggestion-node-hit) {
            color: #3370ff;
            font-weight: 500;
        }
    }

    .data-search-body {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-width: 320px;
        overflow-x: auto;
        // height: calc(100% - 90px);
        height: 120px;
        flex: 1;
        padding: 0 0 0 10px;
        box-sizing: border-box;

        .collapse-title {
            font-family: Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #333333;
            cursor: pointer;
            padding: 0 10px 0 5px;

            &:hover {
                color: #3370ff;
            }
        }

        :deep(.el-divider--horizontal.collapse) {
            margin: 5px 0;
            // padding-right: 20px;
            box-sizing: border-box;

            .el-divider__text {
                padding: 0;
            }
        }

        .form-content {
            max-height: 1000px;
            // min-height: 100px;
            width: 100%;
            overflow: auto;
            padding: 10px 20px 7px 0;
            box-sizing: border-box;
            transition: all 0.3s ease-in-out;

            /* 表单样式 */
            .demo-form {
                margin: 0;
            }

            :deep(.el-form-item) {
                margin-bottom: 10px;
            }
        }

        .list-title {
            font-family: Microsoft YaHei;
            // font-weight: bold;
            font-size: 14px;
            color: #000000;
            padding-bottom: 7px;
            box-sizing: border-box;
        }

        /* 列表样式 */
        .poi-list {
            display: flex;
            height: calc(100% - 30px);
            flex-direction: column;
            gap: 2px;
            padding: 0 0 7px 0px;
            box-sizing: border-box;
            overflow-y: auto;
        }

        /* 单个地点项 */
        .poi-item {
            display: flex;
            width: calc(100% - 5px);
            height: 108px;
            flex-direction: row;
            padding: 7px 6px;
            // border: 1px solid #eee;
            border-radius: 8px;
            background: #fff;
            box-sizing: border-box;
            cursor: pointer;

            &:hover {
                background: #F0F3F8;
            }
        }

        .poi-item-active {
            background: #e6ebf3;
        }
    }

    :deep(.el-divider--horizontal.diver-class) {
        margin: 0;
        min-width: 320px;
    }

    .data-search-footer {
        height: 35px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        min-width: 320px;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #fff;
        overflow-x: auto;

        .el-button {
            height: 24px;
            line-height: 24px;
            border-radius: 2px;
            padding: 0 10px;
        }
    }

    /* 每个信息行的间距 */
    .poi-name,
    .poi-address,
    .poi-lonlat,
    .poi-phone,
    .poi-other {
        margin-bottom: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .poi-other {
        margin-bottom: 0;
    }

    /* 标签和值的样式 */
    .label {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #999999;
    }

    .value {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #999999;
        // margin-left: 4px;
    }

    /* 辅助样式 */
    .poi-name .value {
        font-family: Microsoft YaHei;
        font-weight: 400;
        font-size: 12px;
        color: #333333;
    }

    .ml-2 {
        margin-left: 4px;
    }
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__input.is-indeterminate) {
    top: 4px;
}

.icon {
    font-style: normal;
    margin-left: 8px;
    transition: all 0.3s ease;
}

/* 空数据提示 */
.empty-tip {
    display: flex;
    height: calc(100% - 20px);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #999999;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
    background-color: #fff;

    &::after {
        width: 7px;
        height: 7px;
        background-color: #3370FF
    }
}

:deep(.el-pager li) {
    border-radius: 2px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    min-width: 20px;
    margin: 0 3px;

    &.active {
        background: #2178E8;
        color: #fff
    }

    //     &:hover {
    //         background: #2178E8;
    //         color: #fff
    //     }
}

:deep(.el-pagination button, .el-pagination) {
    height: 20px;
    line-height: 20px;
}

:global(.larger-length) {
    min-width: 100px;
}
</style>
