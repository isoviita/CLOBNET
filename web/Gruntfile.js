module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist:['dist']
		},
		mkdir: {
			all: {
				options: {
					create: ['dist', 'dist/js', 'dist/css', 'dist/webfonts']
				},
			},
		},
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'dist/css/main.css':'src/scss/main.scss'
				}
			}
		},
		copy: {
			includes: {
				expand: true,
				cwd: 'src/includes',
				src: '**',
				dest: 'dist/includes'
			},
			main: {
				expand: true,
				cwd: 'src',
				src: ['*.php', '*.htm', '*.html'],
				dest: 'dist'
			},
			pieces: {
				expand: true,
				cwd: 'src/pieces',
				src: ['*.php', '*.htm', '*.html'],
				dest: 'dist/pieces'
			},			
			bootstrapcss: {
				expand: true,
				cwd: 'node_modules/bootstrap/dist/css',
				src: '**.*',
				dest: 'dist/css/'
			},
			bootstrapjs: {
				expand: true,
				cwd: 'node_modules/bootstrap/dist/js',
				src: '**.*',
				dest: 'dist/js/'
			},
			jquery: {
				expand: true,
				cwd: 'node_modules/jquery/dist/',
				src: 'jquery.min.js',
				dest: 'dist/js/'
			},
			popper: {
				expand: true,
				cwd: 'node_modules/popper.js/dist/umd',
				src: 'popper.js',
				dest: 'dist/js/'
			},
			chartjs: {
				expand: true,
				cwd: 'node_modules/chart.js/dist',
				src: 'Chart.min.js',
				dest: 'dist/js/'
			},
			react: {
				expand: true,
				cwd: 'node_modules/react/umd',
				src: 'react.development.js',
				dest: 'dist/js/'
			},
			reactdom: {
				expand: true,
				cwd: 'node_modules/react-dom/umd',
				src: 'react-dom.development.js',
				dest: 'dist/js/'
			},
			proptypes: {
				expand: true,
				cwd: 'node_modules/prop-types',
				src: 'prop-types.js',
				dest: 'dist/js/'
			},
			datatables: {
				expand: true,
				cwd: 'node_modules/datatables.net/js',
				src: 'jquery.dataTables.min.js',
				dest: 'dist/js/'
			},
			datatablesbscss: {
				expand: true,
				cwd: 'node_modules/datatables.net-bs4/css',
				src: 'dataTables.bootstrap4.min.css',
				dest: 'dist/css/'
			},
			datatablesbsjs: {
				expand: true,
				cwd: 'node_modules/datatables.net-bs4/js',
				src: 'dataTables.bootstrap4.min.js',
				dest: 'dist/js/'
			},
			fontawesome: {
				expand: true,
				cwd: 'node_modules/@fortawesome/fontawesome-free/css',
				src: 'all.min.css',
				dest: 'dist/css/'
			},
			fontawesomewebfonts: {
				expand: true,
				cwd: 'node_modules/@fortawesome/fontawesome-free/webfonts',
				src: '**.*',
				dest: 'dist/webfonts'
			},
			showdown: {
				expand: true,
				cwd: 'node_modules/showdown/dist',
				src: 'showdown.min.js',
				dest: 'dist/js/'
			},
			readme: {
				expand: true,
				cwd: '../',
				src: 'README.md',
				dest: 'dist/'
			}
		},
		chown: {
			options: {
				uid: 1001,
				gid: 33
			},
			target: {
				src: ['dist', 'dist/**']
			},			
		},
		chmod: {
			options: {
				mode: '770'
			},
			target: {
				src: ['dist', 'dist/**']
			},			
		},
		webpack: {
			build: {
				entry: ['/clobnet/v0.8/web/src/js/react.jsx', '/clobnet/v0.8/web/src/js/main.js'],
				output: {
					path: '/clobnet/v0.8/web/dist/js/',
					filename: 'main.js'
				},
				progress: true,
				failOnError: true,
				watch: false,
				module: {
					rules: [
					{
						test: /.jsx?$/,
						exclude: /node_modules/,
						loader: "babel-loader",
						query: {
							presets: ['es2015', 'react']
						}
					}
					]
				}
			}
		},
		watch: {
			scripts: {
				files: ['src/*','src/*/**', '../README.md'],
				tasks: ['clean:dist', 'copy', 'mkdir','sass', 'webpack', 'chown', 'chmod'],
				options: {
					spawn: false,
					interrupt: true
				},
			},
		}		

	});
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-chown');
	grunt.loadNpmTasks('grunt-chmod');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-webpack');	
	grunt.registerTask('default',['clean:dist', 'copy', 'mkdir','sass', 'webpack', 'chown', 'chmod']);
}