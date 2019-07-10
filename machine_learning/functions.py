import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn import tree
from subprocess import call

# Prints out model information after fitting:
def printModelInfo(validation, true_positive, true_negative, false_positive, false_negative, specificity, sensitivity, AUC):
	print '>> Validation: '+validation
	print '>> TP: '+str(true_positive)+' TN: '+str(true_negative)+' FP: '+str(false_positive)+' FN: '+str(false_negative)
	print '>> '+str(specificity)+'% Specificity'
	print '>> '+str(sensitivity)+'% Sensitivity'
	print '>> AUC: '+str(round(AUC, 2))

def printDatasetInfo(label, dataset_length, testset_proportion, trainingset_size, testingset_size, scalename, query):
	print '=================================='
	print 'Prediction: '+label
	print 'Length of dataset: '+str(dataset_length)
	print 'Test set relative size: '+str(testset_proportion)
	print 'Training set n = '+str(trainingset_size)
	print 'Testing set n = '+str(testingset_size)
	print 'Scaling: '+scalename
	print 'SQL Query: '+query+';'
	print ''

# Generate and save AUC plot as EPS and PNG file
def saveAUCPlot(fpr, tpr, AUC, pickle, folder, name, sensitivity, specificity):
	plt.plot(fpr, tpr, label='AUC = %0.3f' % AUC)
	plt.plot([0, 1], [0, 1], 'k--')  # random predictions curve
	plt.xlim([0.0, 1.0])
	plt.ylim([0.0, 1.0])
	plt.xlabel('False Positive Rate or (1 - Specifity)')
	plt.ylabel('True Positive Rate or (Sensitivity)')
	plt.title(name+'\n #'+pickle)
	plt.legend(loc="lower right")
	plt.text(0.7, 0.4, 'Sensitivity', fontsize=10)
	plt.text(0.7, 0.34, str(sensitivity)+'%', fontsize=16)
	plt.text(0.7, 0.27, 'Specificity', fontsize=10)
	plt.text(0.7, 0.21, str(specificity)+'%', fontsize=16)	
	plt.savefig(folder+'/'+str(pickle)+'.eps')
	plt.savefig(folder+'/'+str(pickle)+'.png')
	plt.clf()

# Generate and save Decision tree:
def exportDecisionTree(clf, pickle, input_pieces, folder):
		#export .dot file
		tree.export_graphviz(clf, out_file=folder+'/'+pickle+'.dot')
		dtfile = ''

		#read the .dot file
		with open('decision_trees/'+pickle+'.dot', 'r') as myfile:
			dtfile = myfile.read()

		#replace codes with names of variables
		for i in range(0, len(input_pieces)):
			to_replace = 'X['+str(i)+'] ';
			replacer = str(input_pieces[i])
			dtfile = dtfile.replace(to_replace, replacer)

		dtfile = dtfile.replace('<= 0.5\n', 'is false\n')

		#save the dot file
		with open('decision_trees/'+pickle+'.dot', 'w') as myfile:
			myfile.write(dtfile)

		#convert to png
		call('dot -Tpng decision_trees/'+pickle+'.dot -o decision_trees/png/'+pickle+'.png', shell=True)