"use strict"

function forward(params, history)
{
    const yesterday = history[history.length - 1];
    const num_new_infected = yesterday.num_contagious * params.r0 * yesterday.num_left / params.num_total / params.days_contagious;

    let num_new_contagious = 0;
    if (history.length >= params.days_incubation) {
        const someTimeAgo = history[history.length - params.days_incubation];
        num_new_contagious = someTimeAgo.num_new_infected;
    }

    let num_new_immune = 0;
    let num_new_lost = 0;
    if (history.length >= params.days_incubation + params.days_contagious) {
        const someTimeAgo = history[history.length - params.days_incubation - params.days_contagious]
        num_new_immune = someTimeAgo.num_new_infected * (1 - params.fatality_rate);
        num_new_lost = someTimeAgo.num_new_infected * params.fatality_rate;
    }

    return {
        num_new_infected: num_new_infected,
        num_infected: yesterday.num_infected + num_new_infected - num_new_immune - num_new_lost,
        num_infected_total: yesterday.num_infected_total + num_new_infected,
        num_new_contagious: num_new_contagious,
        num_contagious: yesterday.num_contagious + num_new_contagious - num_new_immune - num_new_lost,
        num_contagious_total: yesterday.num_contagious_total + num_new_contagious,
        num_new_immune: num_new_immune,
        num_immune: yesterday.num_immune + num_new_immune,
        num_new_lost: num_new_lost,
        num_lost: yesterday.num_lost + num_new_lost,
        num_left: yesterday.num_left - num_new_infected,
        day: yesterday.day + 1,
    };
}

function runSimulation(params)
{
    const state = {
        num_infected: params.num_infected,
        num_new_infected: params.num_infected,
        num_infected_total: params.num_infected,
        num_contagious: 0,
        num_contagious_total: 0,
        num_immune: params.num_immune,
        num_lost: 0,
        num_left: params.num_total - params.num_infected - params.num_immune,
        day: 0,
    };

    let result = [state];

    for (let day = 0; day < params.days; day++) {
        result.push(forward(params, result));
    }

    console.log(result);

    return result;
}

function getParams()
{
    return {
        // Number of people that got the infection at day 0.
        num_infected: 1000,
        // Number of people already immune.
        num_immune: 0,
        // Basic reproduction number.
        // Number of new cases for each infected individual.
        // See https://en.wikipedia.org/wiki/Basic_reproduction_number
        // for more information in general about this constant.
        r0: 2.5,
        // Incubation time, in days.
        days_incubation: 4,
        // Number of days contagious after incubation time.
        days_contagious: 14,
        // Probability that a case needs medical care.
        p_need_care: 0.02,
        // Probability that a life is lost.
        fatality_rate: 0.01,
        // Number of days to simulate.
        days: 90,
        // Size of population.
        num_total: 1000000,
    };
}
