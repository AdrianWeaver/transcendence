#!/bin/bash

files_that_should_fail=$(ls wrong_commits | sed -n '2, $p')
files_that_should_succeed=$(ls correct_commits | sed -n '2,$p')

for files in $files_that_should_fail
do
	bash .githooks/commit-msg wrong_commits/${files} 1>/dev/null
	if [[ $? == 0 ]]
	then
		echo "file wrong_commits/$files should have failed but succeeded"
	fi
done

for files in $files_that_should_succeed
do
	bash .githooks/commit-msg correct_commits/${files} 1>/dev/null
	if [[ $? == 1 ]]
	then
		echo "file correct_commits/$files should have succeeded but failed"
	fi
done


