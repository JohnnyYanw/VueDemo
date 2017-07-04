// 存取localStorage中的数据
var store = {
	// 
	save: function(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	fetch: function(key) {
		return JSON.parse(localStorage.getItem(key)) || [];
	}
};

var tasks = store.fetch('new-task');

// 过滤的情况有三种：alltasks finished unfinished
var filter = {
	alltasks: function(list) {
		return list;
	},
	finished: function(list) {
		return list.filter(function(item) {
			return item.isChecked;
		});
	},
	unfinished: function(list) {
		return list.filter(function(item) {
			return !item.isChecked;
		});
	}
};

/*var tasks = [
	{
		title: 'Vue基础',
		isChecked: true
	},
	{
		title: 'Vue进阶',
		isChecked: false
	},
	{
		title: 'vue-router',
		isChecked: false
	}
];*/

var vm = new Vue({
	el: '.main',
	data: {
		tasks: tasks,
		task: '',
		editors: '',
		beforeTitle: '',
		visibility: 'alltasks'
	},
	computed: {
		// 未完成的学习任务的数量
		noCheckedLen: function() {
			return this.tasks.filter(function(item) {
				return !item.isChecked;
			}).length;
		},
		// 通过hash值对数据进行筛选
		filterTasks: function() {
			return filter[this.visibility]? filter[this.visibility](tasks): tasks;
		}
	},
	watch: {
		// 监控tasks的数据变化
		tasks: {
			handler: function() {
				store.save('new-task', this.tasks);
			},
			deep: true
		}
	},
	methods: {
		// 添加任务
		addTask: function() {
			if(this.task !== '') {
				this.tasks.push({
					title: this.task,
					isChecked: false
				});
				this.task = '';
			}
		},
		// 删除任务
		delTask: function(item) {
			var index = this.tasks.indexOf(item);
			this.tasks.splice(index, 1);
		},
		// 编辑任务
		editTask: function(item) {
			// 记录下编辑前的title
			this.beforeTitle = item.title;

			this.editors = item;
		},
		// 编辑任务完成后
		edittedTask: function(item) {
			this.editors = '';
		},
		// 取消编辑任务
		cancelEditTask: function(item) {
			item.title = this.beforeTitle;

			this.editors = '';
		}
	},
	directives: {
		// 点击任务列表时，让编辑框自动聚焦
		focus: {
			update: function(el, binding) {
				if(binding.value) {
					el.focus();
				}
			}
		}
	}
});

watchHashChange();

// 利用hash切换任务列表
function watchHashChange() {
	var hash = window.location.hash.slice(1); // 去除hash前的#
	vm.visibility = hash;
};

window.addEventListener('hashchange', watchHashChange);