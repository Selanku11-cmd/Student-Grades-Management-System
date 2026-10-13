#include <iostream>
#include <string>
#include <iomanip>
#include <limits>
using namespace std;
const int MAX_STUDENTS=100;
string names[MAX_STUDENTS];
int scores[MAX_STUDENTS], studentCount=0;
void flushLine(){cin.ignore(numeric_limits<streamsize>::max(),'\n');}
int readInt(string prompt,int low,int high){int x;while(true){cout<<prompt;if(cin>>x && x>=low && x<=high){flushLine();return x;}cout<<"Invalid input.\n";cin.clear();flushLine();}}
string grade(int n){if(n>=80)return "A";if(n>=75)return "B+";if(n>=70)return "B";if(n>=65)return "C+";if(n>=60)return "C";if(n>=55)return "D+";if(n>=50)return "D";return "F";}
int findStudent(string name){for(int i=0;i<studentCount;i++)if(names[i]==name)return i;return -1;}
int main(){while(true){cout<<"\nSTUDENT GRADE MANAGEMENT USING ARRAYS\n1. Add student\n2. Display students\n3. Search student\n4. Update score\n5. Delete student\n6. Class statistics\n7. Exit\n";int choice=readInt("Choice: ",1,7);if(choice==7)break;if(choice==1){if(studentCount==MAX_STUDENTS){cout<<"Array full\n";continue;}cout<<"Name: ";string name;getline(cin,name);if(name.empty()){cout<<"Name required\n";continue;}int score=readInt("Score (0-100): ",0,100);names[studentCount]=name;scores[studentCount++]=score;cout<<"Added using array indexing.\n";}else if(choice==2){for(int i=0;i<studentCount;i++)cout<<"["<<i<<"] "<<names[i]<<" | "<<scores[i]<<" | "<<grade(scores[i])<<"\n";}else if(choice==6){if(!studentCount){cout<<"No students\n";continue;}int sum=0,hi=scores[0],lo=scores[0];for(int i=0;i<studentCount;i++){sum+=scores[i];if(scores[i]>hi)hi=scores[i];if(scores[i]<lo)lo=scores[i];}cout<<fixed<<setprecision(2)<<"Average: "<<(double)sum/studentCount<<" Highest: "<<hi<<" Lowest: "<<lo<<"\n";}else{cout<<"Enter exact student name: ";string name;getline(cin,name);int i=findStudent(name);if(i<0){cout<<"Not found\n";continue;}if(choice==3)cout<<"Index "<<i<<": "<<names[i]<<" scored "<<scores[i]<<" ("<<grade(scores[i])<<")\n";else if(choice==4){scores[i]=readInt("New score: ",0,100);cout<<"Updated\n";}else if(choice==5){for(int j=i;j<studentCount-1;j++){names[j]=names[j+1];scores[j]=scores[j+1];}studentCount--;cout<<"Deleted and shifted array elements\n";}}}return 0;}
