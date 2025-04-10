# Student Success Prediction Model: Data-Driven Behavioral Insights
### See the model in action: [Click here to visit the Demo Site](https://alanbjordan.github.io/StudentSuccessPredictor/)

## **Overview**

This notebook demonstrates a complete machine learning workflow aimed at predicting early **student success** in an online education program. The goal is to use onboarding assessment and early participation data from the first 30 days to identify which students are likely to succeed — and which ones may need early intervention.

---

## **What's Inside**

- **Data Simulation & Preparation**  
  A synthetic dataset of 50 students, including onboarding scores, class attendance, homework submission rates, platform usage, and participation scores.

- **Data Cleaning & Imputation**  
  Missing values are identified and filled using **linear regression-based imputation**, ensuring data quality while retaining trends and relationships.

- **Clustering & Behavioral Insights**  
  Using **KMeans clustering** and **PCA**, students are grouped into 3 distinct behavioral personas:
  - **High Achieving Learners**
  - **Average Learners**
  - **Struggling Learners**



- **Exploratory Visualization**  
  Engagement metrics are visualized to highlight differences between behavioral groups.

- **Predictive Modeling**  
  Built a **Logistic Regression** classification algorithm to predict student success based on early behavioral and performance data.

- **LLM Integration**

  This LLM integration bridges the gap between raw predictive outputs and practical decision-making:
    - Interpretability: The LLM translates numerical predictions into meaningful narratives.
    - Personalization: Recommendations are customized based on individual student data and behavioral personas.
    - Efficiency: Educators receive instant, detailed feedback without needing to manually analyze model results.

---

## **Business Use Case**

By predicting student success early, education teams can:
- Design **targeted interventions** for at-risk learners
- Reduce Student Churn
- Improve overall student engagement and outcomes
- Allocate tutoring resources more effectively

---

> This is a demonstration of how machine learning, behavioral segmentation, and generative AI can work together to turn behavioral and performance data into **actionable insights**.
