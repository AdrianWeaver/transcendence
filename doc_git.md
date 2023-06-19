# OUR FLOW :

#### Branch creation:

We always work on our own branch, which will be named in the same fashion : "[initials]/[feature]" == el/my_new_branch
To create such a branch
	git checkout -b [initials]/[branch name]

/!\ No one is allowed to code on this branch, except its owner. If you need to test it or you need some of the code, you **must** create a new branch using the above command.

#### Branch rebase to apply changes after a Pull Request(PR):

Make sure you are on master with:
	git checkout master

Apply the changes to your local master branch:
	git pull

Now you need to update your local [in]/[branch]:
	git checkout [in]/[branch]
	git rebase master

You may have conflicts to deal with. While they seem daunting at first, take a deep breath and carefully deal with them one by one.
If several commits are to be applied to your branch, you might have to deal with several waves of conflicts.
Fix the files, add them, then check the message on the terminal and type:
	git rebase --continue
when prompted
/!\ At this stage, you **must** test your code to ensure that the conflicts were properly resolved and everything runs as smoothly as expected.

#### WIP-free working tree:

We don't really want all the unfinished stages of a feature to appear on a MERGE commit, so we re-write history:
	git rebase -i HEAD~[nd_of_commits_to_review]
A page will open where you will see each commit displayed on one line each, preceded with the keyword "pick".
example :
> pick 07c5abd FIX LEAKS:
> pick de9b1eb WIP THIS MUST GO:
> pick 3e7ee36 WIP THIS TOO:
> pick fa20af3 ADD THIS WILL STAY:
You want to merge #de9 #3e7 and #fa2 together, typing "squash" instead of "pick" before the #3e7 and #fa2.
/!\ SQUASH will meld the selected commit into the _previous_ one : #de9 will be squashed with #3e7 but we don't select it /!\
> pick 07c5abd FIX LEAKS:
> pick de9b1eb WIP THIS MUST GO:
> squash 3e7ee36 WIP THIS TOO:
> squash fa20af3 ADD THIS WILL STAY:

This will be displayed: 

> # This is a combination of 3 commits.
> # The first commit's message is:
> FIX LEAKS:
> 
> # This is the 2nd commit message:
> 
> WIP THIS MUST GO:
> 
> # This is the 3rd commit message:
> 
> ADD THIS WILL STAY:

Add the last commit (the one you wish to keep) on top of the commit message and your good to go ! I usually keep the commit separators for clarity:

> ADD THIS WILL STAY:
>  This is a combination of 3 commits.
>  The first commit's message is:
> FIX LEAKS:
> 
>  This is the 2nd commit message:
> 
> WIP THIS MUST GO:
> 
>  This is the 3rd commit message:
> 
> ADD THIS WILL STAY:

If you had already pushed the commits you've just squashed, you will to force the next push
	git push --force

#### GIT ADD -P:

You may want to add some lines of your file instead of all of it (you want to commit your progress but not all your dev-messages "#std::cout<<"hey"<<std::endl;").
	git add -p filename
will interactively highlight block of lines which had undergone a change since the last commit.
- if you want to keep those lines as they are, type "y" and you will be shown the following ones.
- if you do not, type "e" and the editor will give you the possiblity to single out each line out of the block and decide whether you want to add them.

When you reach the end of the file, commit as usual.