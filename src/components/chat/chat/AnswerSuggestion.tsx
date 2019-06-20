import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'
import * as React from 'react'

const GET_SUGGESTED_ANSWER_QUERY = gql`
query GetSuggestedAnswer ($question: String) 
{
  getAnswerSuggestion(question: $question) {
    message
           
  }
}
`;

interface props {
	question: String
}

export default class AnswerSuggestion extends React.PureComponent <props,{}> {

	public render(){

		const questionToAnalyze = "hej"//this.props.question;

		return (

			<Query query={GET_SUGGESTED_ANSWER_QUERY} variables={{question: questionToAnalyze}}>
	        {({ data, loading, error }) => {
	          if (loading) return <div> Loading</div>;
	          if (error) return <p>{console.log(error)} ERROR!</p>;



	          return (
	            <div>
	                <p>{JSON.parse(data.getAnswerSuggestion.message)[0].reply}</p>	                
	                
	            </div>
	            )
	        }}

      		</Query>
		)
	}
}