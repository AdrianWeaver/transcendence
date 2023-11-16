while IFS= read -r line
do
	echo -e "$line"
done < "./env.sample"